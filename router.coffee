define ["ural/routerBase"], (routerBase) ->

  class Router extends routerBase.RouterBase
    constructor: ->
      #important: think about Controller path in the context of routerBase
      super "Controllers", "Product/index"

  Router : Router