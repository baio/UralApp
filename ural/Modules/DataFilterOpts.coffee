define ->

  class ExpandOpts

    constructor: ->
      @opts = []

    add: (srcName, optName, expand) ->
      srcName ?= ""
      @opts[srcName+":"+optName] = expand

    remove: (srcName, optName) ->
      srcName ?= ""
      delete @opts[srcName+":"+optName]

    get: (srcName, optName) ->
      res = @opts[srcName+":"+optName]
      res ?= @opts[":"+optName]

  class OrderBy

    constructor: ->
        @_def = null

    def: (d) ->
      if d != undefined
        @_def = d
      @_def

  expandOpts : new ExpandOpts()
  orderBy : new OrderBy()