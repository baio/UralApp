define ["Ural/Modules/DataProvider", "Ural/Modules/PubSub"], (dataProvider, pubSub) ->

  class ItemVM

    constructor: (@typeName, @item, @mappingRules) ->
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
        if @onDone then @onDone null, true
      else
        isAdded = @item.id() == -1
        @update (err, item) =>
          if !err
            @_createOrigin()
            if isAdded then pubSub.pub "model", "list_changed", item : item, changeType : "added", isExternal : false
          if @onDone then @onDone err, false

    update: (onDone) ->
      remove = @getRemovedRefs()
      remove ?= {}
      @onUpdate @item, remove, onDone

    remove: (onDone) ->
      @onRemove @item, (err) =>
        if !err then pubSub.pub "model", "list_changed", itemVM : @, changeType : "removed", isExternal : false
        if onDone then onDone err, @item

  #--- update region

    _getModelModule: (callback) ->
      require ["Models/#{@typeName.toLowerCase()}"], (module) ->
        callback null, module

    #update item from raw (json data)
    _updateItem: (data, item, modelModule)->
      item.id data.id
      ko.mapping.fromJS data, modelModule.mappingRules, item

    #convert app model to raw data (json)
    _mapToData: (item, modelModule) ->
      ko.mapping.toJS item

    ###
    converge item, remove pair to a single object complyed to dataProvider.save
    i.e. removed item should be included in the updated object with {id : id, __action = "delete"}
    ###
    @_prepareDataForSave: (item, remove) ->
      res = item
      for own prop of item
        val = remove[prop]
        if Array.isArray val
          res[prop].push id : id, __action : "delete" for id in val
        else if typeof val == "object"
          ItemVM._prepareDataForSave item[prop], val
        else if val
          res[prop].id = val
          res[prop].__action = "delete"
      res

    onUpdate: (item, remove, onDone) ->
      if Array.isArray item then throw "upade of multiple items is not supported!"
      dataForSave = ItemVM._prepareDataForSave @_mapToData(item), remove
      async.waterfall [
        (ck) =>
          dataProvider.get().save @typeName, dataForSave, ck
        ,(data, ck) =>
          @_getModelModule (err, modelModule) -> ck err, data, modelModule
      ],(err, data, modelModule) =>
        if !err then @_updateItem data, item, modelModule
        onDone err, item

    onRemove: (item, onDone) ->
      if Array.isArray item then throw "delete of multiple items is not supported!"
      dataProvider.get().delete @typeName, item.id(), onDone

  #--- update region ^

  ItemVM : ItemVM