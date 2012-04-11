define ->

  class RouterBase
    constructor: (@controllerDirectory, @defaultRoute) ->
      @currentHash = ""

    startRouting: (@onRouteChangedCallback) ->
      window.location.hash = window.location.hash or @defaultRoute
      setInterval (=> @hashCheck()), 100

    hashCheck: ->
      if window.location.hash != @currentHash
        @currentHash = window.location.hash
        @refresh()

    refresh: ->
      regexp = new RegExp "#/?(\\w+)/(\\w+)/?(\\w+)?"
      match = @currentHash.match regexp
      controller = match[1]
      action = match[2]
      index = match[3]
      controllerName = "#{controller}Controller"
      capControllerName = "#{_.str.capitalize controller}Controller"
      require ["#{@controllerDirectory}/#{controllerName}"], (controllerModule) =>
        eval "new controllerModule.#{capControllerName}().#{action}(#{index})"
        @onRouteChanged controller, action

    onRouteChanged: (controller, action) ->
      if @onRouteChangedCallback then @onRouteChangedCallback controller, action

  RouterBase : RouterBase
