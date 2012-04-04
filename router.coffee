define ["Ural/routerBase"], (routerBase) ->

  class Router extends routerBase.RouterBase

    constructor: ->
      super "Controllers", "product/index"

    onRouteChanged: (controller, action) ->
      $(".navbar .nav li.active").removeClass "active"
      $(".navbar .nav a[href='##{controller}/#{action}']").parent().addClass "active"
      super controller, action

  Router : Router