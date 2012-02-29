define ->

  class ControllerBase
    constructor: ->
      @viewDir = _u.getClassName @

    index: ->
      @view null, "Views/Shared/_index"

    details: (id) ->

    edit: (id) ->

    view: (model, viewPath, layoutViewPath) ->
      viewPath = @_prepareViewPath viewPath
      layoutViewPath = @_prepareViewPath layoutViewPath, "Views/Shared/_layout"
      require ["Ural/text!#{layoutViewPath}"], (html) ->
        $("#_layout").empty()
        $("#_layout").append html
        require ["Ural/text!#{viewPath}"], (html) ->
          $("#_body").append html

    _prepareViewPath: (path, defPath) ->
      path ?= defPath
      if !path.match /.*\.htm[l]?/
        path += ".html"

  ControllerBase : ControllerBase
