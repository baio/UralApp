define ->

  class RouterBase
    constructor: (@controllerDirectory, @defaultRoute) ->
      @currentHash = ""
      @onRouteChanged = null

    startRouting: (OnRouteChanged) ->
      @onRouteChanged = OnRouteChanged
      window.location.hash = window.location.hash or @defaultRoute
      setInterval (=> @hashCheck()), 100

    hashCheck: ->
      if window.location.hash != @currentHash
        @currentHash = window.location.hash
        @refresh()
        if (@onRouteChanged) then @onRouteChanged @currentHash

    refresh: ->
      regexp = new RegExp "#/?(\\w+)/(\\w+)/?(\\w+)?"
      match = @currentHash.match regexp
      controllerName = match[1]
      actionName = match[2]
      index = match[3]
      controllerName = "#{controllerName}Controller"
      require ["#{@controllerDirectory}/#{controllerName}"], (controller) ->
        eval "new controller.#{controllerName}().#{actionName}(#{index})"

  RouterBase : RouterBase
