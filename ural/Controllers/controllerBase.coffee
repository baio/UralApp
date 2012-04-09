define ["Ural/Modules/ODataProvider"
  , "Ural/Modules/WebSqlProvider"
  , "Ural/Models/indexVM"
  , "Ural/Models/itemVM"
  , "Ural/Modules/pubSub"
], (odataProvider, webSqlProvider, indexVM, itemVM, pubSub) ->

  class ControllerBase
    constructor: (@modelName, @opts)->
      @modelName ?= @_getControllerName()
      @_dataProviders = _u.toHashTable @onCreateDataProviders()
      @defaultDataProviderName = _u.firstKey @_dataProviders

      pubSub.subOnce "model", "edit", @modelName, (model, name) =>
        if @_isOwnModel model
          @_showForm name

      pubSub.subOnce "model", "create", @modelName, (model, name) =>
        if @_isOwnModel model
          @_showForm name

      pubSub.subOnce "model", "end_edit", @modelName, (model, name) =>
        if @_isOwnModel model
          @_hideForm "edit"

      pubSub.subOnce "model", "end_create", @modelName, (model, name) =>
        if @_isOwnModel model
          @_hideForm "create"

      pubSub.subOnce "model", "detail", @modelName, (model, name) =>
        if @_isOwnModel model
          @onShowDetails model

      pubSub.subOnce "model", "save", @modelName, (data, name, callback) =>
        if @_isOwnModel data.item
          @onSave data.item, data.remove, callback

      pubSub.subOnce "model", "remove", @modelName, (data, name, callback) =>
        if @_isOwnModel data.item
          @onDelete data.item, callback


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
      item.id data.id
      ko.mapping.fromJS data, modelModule.mappingRules, item

    #convert app model to raw data (json)
    _mapToData: (item, modelModule) ->
      ko.mapping.toJS item

    _showForm: (type) ->
      @onShowForm $("[data-form-model-type='#{@modelName}'][data-form-type='#{type}']")

    onShowForm: ($form) ->
      $form.show()

    _hideForm: (type) ->
      @onHideForm $("[data-form-model-type='#{@modelName}'][data-form-type='#{type}']")

    onHideForm: ($form) ->
      $form.hide()

    onShowDetails: (model) ->
      window.location.hash = "#{@modelName}/item/#{model.id()}"

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
        else if val
          res[prop].id = val
          res[prop].__action = "delete"
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
          if !err then @_updateItem data, item, modelModule
          onDone err, item

    onDelete: (item, onDone) ->
      if Array.isArray item then throw "delete of multiple items is not supported!"
      @getDataProvider().delete @modelName, item.id(), onDone

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
          viewModel = @onCreateIndexViewModel model, modelModule
          @view viewModel, "index", null, (err) -> ck err, viewModel
      ], onDone

    onCreateIndexViewModel: (model, modelModule) ->
      new indexVM.IndexVM @modelName, model, modelModule.mappingRules

    item: (id, onDone)->
      async.waterfall [
        (ck) =>
          @getDataProvider().load @modelName, {id : { $eq : id}, $expand : "$item"}, ck
        ,(data, ck) =>
          @_getModelModule (err, modelModule) -> ck err, data, modelModule
        ,(data, modelModule, ck) =>
          model = @_mapToItems data, modelModule
          viewModel = @onCreateItemViewModel model[0], modelModule.mappingRules
          @view viewModel, "item", null, (err) ->
            viewModel.edit()
            ck err, viewModel
      ], onDone

    onCreateItemViewModel: (model, modelModule) ->
      new itemVM.ItemVM @modelName, model, modelModule.mappingRules

    view: (viewModel, viewPath, layoutViewPath, onDone) ->
      crName = @_getControllerName()
      lvp = ControllerBase._prepareViewPath crName, layoutViewPath, "Shared/_layout"
      bvp = ControllerBase._prepareViewPath crName, viewPath

      async.waterfall [
        (ck) ->
          require ["Ural/text!#{lvp}"], (layoutHtml) ->
            ck null, layoutHtml
        ,(layoutHtml, ck) ->
          ControllerBase._renderPartialViews crName, layoutHtml, ck
        ,(layoutHtml, ck) ->
          require ["Ural/text!#{bvp}"], (bodyHtml) ->
            ck null, layoutHtml, bodyHtml
        ,(layoutHtml, bodyHtml, ck) ->
          ControllerBase._renderPartialViews crName, bodyHtml, (err, renderedBody) ->
            ck err, layoutHtml, renderedBody
        ,(layoutHtml, bodyHtml, ck) ->
          $("#_layout").empty()
          $("#_layout").append layoutHtml
          $("#_body").append bodyHtml
          ko.applyBindings viewModel
          ck()
      ], (err) -> if onDone then onDone err


    @_renderPartialViews: (controllerName, html, callback) ->
      html = _u.wrapHtml html
      ControllerBase.__renderPartialViews controllerName, html, (err, renderedHtml) ->
        if renderedHtml then renderedHtml = $(renderedHtml).html()
        callback err, renderedHtml

    @__renderPartialViews: (controllerName, html, callback) ->
      partialViews = $("[data-partial-view]", html)
      paths = partialViews.map (i, p) ->
        "Ural/text!#{ControllerBase._prepareViewPath controllerName, $(p).attr "data-partial-view"}"
      if paths.length
        require $.makeArray(paths), ->
          partialHtmls = _u.argsToArray arguments
          for partialHtml, i in partialHtmls
            $h = $(html)
            $pratialViewTag = $h.find "[data-partial-view]:eq(#{i})"
            viewBag = $pratialViewTag.attr "data-partial-view-bag"
            $pratialViewTag.removeAttr "data-partial-view"
            $pratialViewTag.removeAttr "data-partial-view-bag"
            if viewBag
              jViewBag = eval "(#{viewBag})"
              $.templates pvt : partialHtml
              partialHtml = $.render.pvt jViewBag
            $pratialViewTag.html partialHtml
            html = _u.wrapHtml $h.html()
          async.forEachSeries partialHtmls
            ,(ph, ck) ->
              ControllerBase.__renderPartialViews controllerName, html, (err, renderedHtml) ->
                html = renderedHtml
                ck err
            ,(err) -> callback err, html
      else
        callback null, html

    @_prepareViewPath: (controllerName, path, defPath) ->
      path ?= defPath
      if path
        if !path.match /.*\.htm[l]?/
          path += ".html"
        if !path.match /^Views\/.*/
          if !path.match /.*\/.*/
            "Views/#{controllerName}/#{path}"
          else
            "Views/#{path}"
        else
          path

    _getControllerName: -> _u.getClassName(@).replace /^(\w*)Controller$/, "$1"

  ControllerBase : ControllerBase