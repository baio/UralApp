define ["Ural/Modules/DataProvider"
  , "Ural/Models/indexVM"
  , "Ural/Models/itemVM"
  , "Ural/Modules/pubSub"
], (dataProvider, indexVM, itemVM, pubSub) ->

  class ControllerBase
    constructor: (@modelName, @opts)->
      @modelName ?= @_getControllerName()
      @defaultIndexLayout = "Shared/_layout"
      @defaultItemLayout = "Shared/_layout"

      pubSub.subOnce "model", "edit", "controller", (model, name) =>
          @_showForm name, _u.getClassName model

      pubSub.subOnce "model", "create", "controller", (model, name) =>
          @_showForm name, _u.getClassName model

      pubSub.subOnce "model", "end_edit", "controller", (model, name) =>
          @_hideForm "edit", _u.getClassName model

      pubSub.subOnce "model", "end_create", "controller", (model, name) =>
          @_hideForm "create", _u.getClassName model

      pubSub.subOnce "model", "detail", "controller", (model, name) =>
          @_showDetails model, _u.getClassName model

    _showForm: (type, typeName) ->
      @onShowForm $("[data-form-model-type='#{typeName}'][data-form-type='#{type}']")

    onShowForm: ($form) ->
      $form.show()

    _hideForm: (type, typeName) ->
      @onHideForm $("[data-form-model-type='#{typeName}'][data-form-type='#{type}']")

    onHideForm: ($form) ->
      $form.hide()

    _showDetails: (model, typeName) ->
      @onShowDetails model.id(), typeName

    onShowDetails: (id, typeName) ->
      window.location.hash = "#{typeName.toLowerCase()}/item/#{id}"

    _getModelModule: (typeName, callback) ->
      require ["Models/#{typeName.toLowerCase()}"], (module) ->
        callback null, module

    #convert raw data (json array) to app model array
    _mapToItems: (data, modelModule)->
      data.map (d) ->
        ko.mapping.fromJS d, modelModule.mappingRules, new modelModule.ModelConstructor()

    index: (filter, onDone)->
      filter ?= {}
      filter.$expand ?= "$index"
      async.waterfall [
        (ck) =>
          dataProvider.get().load @modelName, filter, ck
        ,(data, ck) =>
          @_getModelModule @modelName, (err, modelModule) -> ck err, data, modelModule
        ,(data, modelModule, ck) =>
          model = @_mapToItems data, modelModule
          viewModel = @onCreateIndexViewModel model, modelModule
          @view viewModel, "index", @defaultIndexLayout, (err) -> ck err, viewModel
      ], onDone

    onCreateIndexViewModel: (model, modelModule) ->
      new indexVM.IndexVM @modelName, model, modelModule.mappingRules

    item: (id, onDone)->
      async.waterfall [
        (ck) =>
          dataProvider.get().load @modelName, {id : { $eq : id}, $expand : "$item"}, ck
        ,(data, ck) =>
          @_getModelModule @modelName, (err, modelModule) -> ck err, data, modelModule
        ,(data, modelModule, ck) =>
          model = @_mapToItems data, modelModule
          viewModel = @onCreateItemViewModel model[0], modelModule.mappingRules
          @view viewModel, "item", @defaultItemLayout, (err) ->
            viewModel.edit()
            ck err, viewModel
      ], onDone

    onCreateItemViewModel: (model, modelModule) ->
      new itemVM.ItemVM @modelName, model, modelModule.mappingRules

    view: (viewModel, viewPath, layoutViewPath, onDone) ->
      crName = @_getControllerName()
      lvp = ControllerBase._prepareViewPath crName, layoutViewPath, @defaultItemLayout
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