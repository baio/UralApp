define ["Ural/Modules/PubSub"], (pubSub) ->

  class ItemVM

    constructor: (@item, @mappingRules) ->
      @originItem = null

    _createOrigin: ->
      @originItem = ko.mapping.toJS @item

    _copyFromOrigin: ->
      ko.mapping.fromJS @originItem, @mappingRules, @item

    ###
    Append removed referrences (via comparison with original item)
    ###
    getRemovedRefs: -> ItemVM._getRemovedRefs @originItem, @item

    @_getRemovedRefs: (origItem, curObservableItem) ->
      _setProp = (obj, prop, val) ->
        obj ?= {}
        obj[prop] = val
        obj

      res = null
      for own prop of origItem
        val = origItem[prop]
        if val == null or val == undefined then continue
        if Array.isArray val
          removed = val.filter((v) -> ko.utils.arrayFirst(curObservableItem[prop](), (i) -> i.id() == v.id) == null)
            .map (v) -> v.id
          if removed.length
            res = _setProp res, prop, removed
        else if typeof val == "object"
          obj = curObservableItem[prop]()
          curId = obj.id()
          if curId != val.id and curId == __g.nullRefVal()
            res = _setProp res, prop, val.id
          else
            subRes = ItemVM._getRemovedRefs val, obj
            if subRes then res = _setProp res, prop, subRes
      res

    edit: (@onDone) ->
      if @originItem then throw "item already in edit state"
      @_createOrigin()

    endEdit: ->
      if !@originItem then throw "item not in edit state"
      @originItem = null
      if @onDone
        @onDone = null

    cancel: -> @_done true

    save: (data, event)->
      event.preventDefault()
      @_done false

    _done: (isCancel) ->
      if !@originItem then throw "item not in edit state"
      if isCancel
        @_copyFromOrigin()
        if @onDone then @onDone null, isCancel
      else
        remove = @getRemovedRefs()
        remove ?= {}
        data = item : @item, remove : remove
        pubSub.pub "model", "save", data, (err, item) =>
          if !err
            @_createOrigin()
          if @onDone then @onDone err, isCancel

  ItemVM : ItemVM