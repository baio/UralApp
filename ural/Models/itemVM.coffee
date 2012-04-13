define ["Ural/Modules/DataProvider", "Ural/Modules/PubSub"], (dataProvider, pubSub) ->

  class ItemVM

    constructor: (@typeName, @item, @mappingRules) ->
      @originItem = null
      #if @item.__metadata then @_parseMetadata @item.__metadata

    ###
    _parseMetadata:(metadata) ->
      if metadata.viewModels
        for viewModel in metadata.viewModels
          @[viewModel.name] = new indexRefVM.IndexRefVM @, viewModel.typeName, viewModel.field, viewModel.mapping
    ###

    _createOrigin: ->
      @originItem = ko.mapping.toJS @item

    _copyFromOrigin: ->
      ko.mapping.fromJS @originItem, @mappingRules, @item

    getState: ->
      ItemVM._getState @originItem, @item

    @_getState: (item, observItem)->
      res = {}
      for own prop of item
        val = item[prop]
        _val = observItem[prop]()
        if prop == "id"
          res.id = val
          if val != _val
            if _val == __g.nullRefVal()
              res.__status = "removed"
              return res
            else
              res[prop] == "modifyed"
        else if Array.isArray val
          removed = val.filter((v) -> ko.utils.arrayFirst(_val, (i) -> i.id() == v.id) == null)
            .map (v) -> v.id
          res[prop] = _val.map (v) -> ItemVM._getState val.filter((f)-> f.id == v.id())[0], v
          res[prop].push id : r , __status : "removed" for r in removed
        else if typeof val == "object"
          res[prop] = ItemVM._getState val, _val
        else
          res[prop] = if val != _val then "modifyed" else "unchanged"

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
            if isAdded
              pubSub.pub "model", "list_changed", item : item, changeType : "added", isExternal : false
          if @onDone then @onDone err, false

    update: (onDone) ->
      @onUpdate @item, @getState(), onDone

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

    onUpdate: (item, state, onDone) ->
      if Array.isArray item then throw "upade of multiple items is not supported!"
      #dataForSave = ItemVM._prepareDataForSave @_mapToData(item), remove
      dataForSave = @_mapToData(item)
      dataForSave.__state = state
      async.waterfall [
        (ck) =>
          @onSave @typeName, dataForSave, ck
        ,(data, ck) =>
          @_getModelModule (err, modelModule) -> ck err, data, modelModule
      ],(err, data, modelModule) =>
        if !err then @_updateItem data, item, modelModule
        onDone err, item

    onRemove: (item, onDone) ->
      if Array.isArray item then throw "delete of multiple items is not supported!"
      dataProvider.get().delete @typeName, item.id(), onDone

    onSave: (typeName, dataForSave, onDone) ->
      dataProvider.get().save typeName, dataForSave, onDone

  #--- update region ^

  ItemVM : ItemVM