define ["Ural/routerBase"], (routerBase) ->

  class Router extends routerBase.RouterBase
    constructor: ->
      super "Controllers", "Product/index"

  Router : Router