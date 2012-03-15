define ["Ural/Modules/PubSub"], (pubSub) ->

  class ItemVM

    constructor: (@item) ->
      @originItem = null

    _createOrigin: ->
      @originItem = {}
      for own prop of @item
        if ko.isWriteableObservable(@item[prop])
          @originItem[prop] = @item[prop]()

    _copyFromOrigin: ->
      for own prop of @originItem
        @item[prop] @originItem[prop]

    edit: (@onDone) ->
      if @originItem then throw "item already in edit state"
      @_createOrigin()

    endEdit: ->
      if !@originItem then throw "item not in edit state"
      @originItem = null
      if @onDone
        @onDone = null

    cancel: -> @_done true

    save: -> @_done false

    _done: (isCancel) ->
      if !@originItem then throw "item not in edit state"
      if isCancel
        @_copyFromOrigin()
        if @onDone then @onDone null, isCancel
      else
        @_createOrigin()
        if @onDone then @onDone null, isCancel
        ###
        pubSub.pub "model", "save", @item, (err) =>
          if !err then @_createOrigin()
          if @onDone then @onDone err, isCancel
        ###

  ItemVM : ItemVM