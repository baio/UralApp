define ->

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

    save: -> @_done flase

    _done: (isCancel) ->
      if !@originItem then throw "item not in edit state"
      if isCancel
        @_copyFromOrigin()
      else
        @_createOrigin()
      for own prop of @item
        if isCancel then prop.reset else prop.commit()
      if @onDone
        @onDone isCancel

  ItemVM : ItemVM