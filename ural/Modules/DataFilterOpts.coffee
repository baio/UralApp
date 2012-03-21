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

  expandOpts : new ExpandOpts()