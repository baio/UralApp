define ->

  class ControllerBase
    constructor: ->
      @_dataProviders = _u.toHashTable @onCreateDataProviders()
      @defaultDataProviderName = _u.firstKey @_dataProviders

    onCreateDataProviders: ->
      odataProvider = require ["Ural/Modules/ODataProvider"]
      webSqlProvider = require ["Ural/Modules/WebSqlProvider"]

      [
        { name : "odata", provider : odataProvider }
        { name : "websql", provider : webSqlProvider }
      ]

    getDataProvider: (name) ->
      name ?= @defaultDataProviderName
      @_dataProviders[name]

    index: ->
      @view null, "index"

    details: (id) ->

    edit: (id) ->

    view: (model, viewPath, layoutViewPath) ->
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
          ck()
      ]

    _prepareViewPath: (path, defPath) ->
      path ?= defPath
      if path
        if !path.match /.*\.htm[l]?/
          path += ".html"
        if !path.match /^Views\/.*/
          if !path.match /.*\/.*/
            controllerName = _u.getClassName(@).replace /^(\w*)Controller$/, "$1"
            "Views/#{controllerName}/#{path}"
          else
            "Views/#{path}"
        else
          path

  ControllerBase : ControllerBase



