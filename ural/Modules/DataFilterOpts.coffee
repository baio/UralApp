define ->

  class ExpandOpts
    constructor: ->
      @opts = []

    add: (srcName, optName, expand) ->
      @opts[srcName+":"+optName] = expand

    remove: (srcName, optName) ->
      delete @opts[srcName+":"+optName]

    get: (srcName, optName) ->
      @opts[srcName+":"+optName]

  expandOpts : new ExpandOpts()