define ->

  class ControllerBase

    index: ->
      @view "Index"

    details: (id) ->

    edit: (id) ->

    view: (model, viewPath, layoutViewPath) ->
      lvp = @_prepareViewPath layoutViewPath, "Shared/_layout"
      bvp = @_prepareViewPath viewPath
      ###
      layoutHtml = require ["Ural/text!#{lvp}"]
      if layoutHtml
        bodyHtml = require ["Ural/text!#{bvp}"]
        if !bodyHtml
          $("#_layout").empty()
          $("#_layout").append layoutHtml
          $("#_body").append bodyHtml
      ###

      async.waterfall [
        (ck) ->
          require ["Ural/text!#{lvp}"], (layoutHtml, err) ->
            ck null, layoutHtml
        ,(layoutHtml, ck) ->
          require ["Ural/text!#{bvp}"], (bodyHtml, err) ->
            ck null, layoutHtml, bodyHtml
        ,(layoutHtml, bodyHtml, ck) ->
          $("#_layout").empty()
          $("#_layout").append layoutHtml
          $("#_body").append bodyHtml
          ck()
      ]
      ###
      if !layoutHtml
        throw "Layout view not found on path #{lvp.toString()}"
      if !bodyHtml
        throw "Body view not found on path #{bvp.toString()}"
      ###
      ###
      layoutViewPaths = @_prepareViewPaths layoutViewPath, "_layout"
      bodyViewPaths = @_prepareViewPaths viewPath
      require ["Ural/text!Views/Shared/_layout1.html"], (html) ->
        console.log html

      for lvp in layoutViewPaths
        try
          layoutHtml = require "Ural/text!#{lvp}"
        catch ex
        if !layoutHtml
          for bvp in bodyViewPaths
            bodyHtml = require ["Ural/text!#{bvp}"]
            if !bodyHtml
              $("#_layout").empty()
              $("#_layout").append layoutHtml
              $("#_body").append bodyHtml
              return
      if !layoutHtml
        #throw "Layout view not found on paths #{layoutViewPaths.toString()}"
      if !bodyHtml
        #throw "Body view not found on paths #{bodyViewPaths.toString()}"
      async.mapSeries layoutViewPaths
        ,(i, ck) -> require ["Ural/text!#{i}"], (html) -> ck html
        ,(layoutHtml) ->
          if !layoutHtml then throw "Layout view not found on paths : #{layoutViewPaths.toString()}"
          async.mapSeries bodyViewPaths
            ,(i, ck) -> require ["Ural/text!#{i}"], (html) -> ck html
            ,(bodyHtml) ->
              if !bodyHtml then throw "Body view not found on paths : #{bodyViewPaths.toString()}"
              $("#_layout").empty()
              $("#_layout").append layoutHtml
              $("#_body").append bodyHtml
      ###

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
            ["Views/#{path}"]
        else
          [path]

  ControllerBase : ControllerBase
