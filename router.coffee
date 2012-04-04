define ["Ural/routerBase"], (routerBase) ->

  class Router extends routerBase.RouterBase

    constructor: ->
      super "Controllers", "product/index"

    onRouteChanged: (controller, action) ->
      $(".navbar .nav li .active").toggleClass "active"
      $(".navbar .nav a[href='##{controller}/#{action}']").parent().toggleClass "active"
      super controller, action

  Router : Router