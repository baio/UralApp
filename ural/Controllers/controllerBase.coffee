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
        if @_isOwnModel model
          @onShowForm "edit"

      pubSub.sub "model", "save", (data, name, callback) =>
        if @_isOwnModel data.item
          @onSave data.item, data.remove, callback

    onCreateDataProviders: ->
      [
        { name : "odata", provider : odataProvider.dataProvider }
        { name : "websql", provider :  webSqlProvider.dataProvider }
      ]

    _getModelModule: (callback) ->
      if @opts and @opts.model
        useCustomModel = @opts.model.useCustomModel
        customModelPath = @opts.model.customModelPath
      customModelPath ?= "Models/#{@modelName}"
      require [customModelPath], (module) ->
        callback null, module

    _isOwnModel: (model) ->
      _u.getClassName(model) == @modelName

    #convert raw data (json array) to app model array
    _mapToItems: (data, modelModule)->
      data.map (d) ->
        ko.mapping.fromJS d, modelModule.mappingRules, new modelModule.ModelConstructor()

    #update item from raw (json data)
    _updateItem: (data, item, modelModule)->
      ko.mapping.fromJS data, modelModule.mappingRules, item

    #convert app model to raw data (json)
    _mapToData: (item, modelModule) ->
      ko.mapping.toJS item

    onShowForm: (type) ->
      $("[data-form-model-type='#{@modelName}'][data-form-type='#{type}']").show()

    ###
    converge item, remove pair to a single object complyed to dataProvider.save
    i.e. removed item should be included in the updated object with {id : id, __action = "delete"}
    ###
    @_prepareDataForSave: (item, remove) ->
      res = item
      for own prop of item
        val = remove[prop]
        if Array.isArray val
          res[prop].push id : id, __action : "delete" for id in val
        else if typeof val == "object"
          ControllerBase._prepareDataForSave item[prop], val
      res

    onSave: (item, remove, onDone) ->
      if Array.isArray item then throw "upade of multiple items is not supported!"
      dataForSave = ControllerBase._prepareDataForSave @_mapToData(item), remove
      async.waterfall [
        (ck) =>
          @getDataProvider().save @modelName, dataForSave, ck
        ,(data, ck) =>
          @_getModelModule (err, modelModule) -> ck err, data, modelModule
      ],(err, data, modelModule) =>
          onDone err, if !err then @_updateItem data, modelModule, item

    getDataProvider: (name) ->
      name ?= @defaultDataProviderName
      @_dataProviders[name]

    index: (filter, onDone)->
      filter ?= {}
      filter.$expand ?= "$index"
      async.waterfall [
        (ck) =>
          @getDataProvider().load @modelName, filter, ck
        ,(data, ck) =>
          @_getModelModule (err, modelModule) -> ck err, data, modelModule
        ,(data, modelModule, ck) =>
          model = @_mapToItems data, modelModule
          viewModel = new indexVM.IndexVM model, modelModule.mappingRules
          @view viewModel, "index", null, (err) -> ck err, viewModel
      ], onDone

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