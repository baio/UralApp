define ["Ural/Modules/ODataProvider"
  , "Ural/Modules/WebSqlProvider"
  , "Ural/Models/indexVM"
  , "Ural/Modules/pubSub"
], (odataProvider, webSqlProvider, indexVM, pubSub) ->

  class ControllerBase
    constructor: (@modelName, @opts)->
      @modelName ?= @_getControllerName()
      @_dataProviders = _u.toHashTable @onCreateDataProviders()
      @defaultDataProviderName = _u.firstKey @_dataProviders

      pubSub.sub "model", "edit", (model, name) =>
        @onShowForm "edit"

    onCreateDataProviders: ->
      [
        { name : "odata", provider : odataProvider.dataProvider }
        { name : "websql", provider :  webSqlProvider.dataProvider }
      ]

    onShowForm: (type) ->
      $("[data-form-model-type='#{@modelName}'][data-form-type='#{type}']").show()

    getDataProvider: (name) ->
      name ?= @defaultDataProviderName
      @_dataProviders[name]

    index: (filter, onDone)->
      if @opts and @opts.model
        useCustomModel = @opts.model.useCustomModel
        customModelPath = @opts.model.customModelPath
        customModelPath ?= "Models/#{@modelName}"
      async.waterfall [
        (ck) =>
          @getDataProvider().load @modelName, filter, ck
        ,(data, ck) ->
          if useCustomModel
            require [customModelPath], (modelModule) ->
              model = data.map (d) -> ko.mapping.fromJS d, modelModule.mappingRules, new modelModule.ModelConstructor()
              ck null, model
          else
            ck null, data
        ],
        (err, model) =>
          if !err
            viewModel = new indexVM.IndexVM model
            @view viewModel, "index", null, (err) -> if onDone then onDone err, viewModel
          else
            if onDone then onDone err

    view: (viewModel, viewPath, layoutViewPath, onDone) ->
      lvp = @_prepareViewPath layoutViewPath, "Shared/_layout"
      bvp = @_prepareViewPath viewPath

      async.waterfall [
        (ck) ->
          require ["Ural/text!#{lvp}"], (layoutHtml) ->
            ck null, layoutHtml
        ,(layoutHtml, ck) ->
          require ["Ural/text!#{bvp}"], (bodyHtml) ->
            ck null, layoutHtml, bodyHtml
        ,(layoutHtml, bodyHtml, ck) ->
          $("#_layout").empty()
          $("#_layout").append layoutHtml
          $("#_body").append bodyHtml
          ko.applyBindings viewModel
          ck()
      ], (err) -> if onDone then onDone err

    _prepareViewPath: (path, defPath) ->
      path ?= defPath
      if path
        if !path.match /.*\.htm[l]?/
          path += ".html"
        if !path.match /^Views\/.*/
          if !path.match /.*\/.*/
            controllerName = @_getControllerName()
            "Views/#{controllerName}/#{path}"
          else
            "Views/#{path}"
        else
          path

    _getControllerName: -> _u.getClassName(@).replace /^(\w*)Controller$/, "$1"

  ControllerBase : ControllerBase



