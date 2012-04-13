define ["Ural/Modules/DataProvider", "Ural/Modules/PubSub", "Ural/Models/indexVM"], (dataProvider, pubSub, indexVM) ->

  class ItemVM

    constructor: (@typeName) ->
      @originItem = null
      @modelModule = null

    map: (data, ini, onDone) ->
      require ["Models/#{@typeName.toLowerCase()}"], (module) =>
        meta = module.metadata
        #TO DO: make mapping and defs automatically when not defined in meta
        if !meta then throw "not impl: meta must be defined"
        if !meta.mapping then throw "not impl: mapping must be defined"
        if !meta.def then throw "not impl: def must be defined"
        if !data and !ini then throw "data arg must be provided"
        if ini
          @item = new module.ModelConstructor()
          ko.mapping.fromJS (if data then data else meta.def), meta.mapping, @item
          if meta.viewModels
            for viewModel in meta.viewModels
              @[viewModel.name] = new indexRefVM.IndexRefVM @, viewModel.typeName, viewModel.field
        else
          ko.mapping.fromJS data, meta.mapping, @item
        onDone null, @

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
        @update (err) =>
          if !err
            @_createOrigin()
            if isAdded
              pubSub.pub "model", "list_changed", itemVM : @, changeType : "added", isExternal : false
          if @onDone then @onDone err, false

    update: (onDone) ->
      @onUpdate @getState(), onDone

    remove: (onDone) ->
      @onRemove (err) =>
        if !err then pubSub.pub "model", "list_changed", itemVM : @, changeType : "removed", isExternal : false
        if onDone then onDone err, @item

    #--- update region

    #convert app model to raw data (json)
    _mapToData: ->
      ko.mapping.toJS @item

    onUpdate: (state, onDone) ->
      dataForSave = @_mapToData()
      dataForSave.__state = state
      async.waterfall [
        (ck) =>
          @onSave @typeName, dataForSave, ck
        , (data, ck) =>
            @map data, false, ck
        ], onDone

    onRemove: (onDone) ->
      dataProvider.get().delete @typeName, @item.id(), onDone

    onSave: (typeName, dataForSave, onDone) ->
      dataProvider.get().save typeName, dataForSave, onDone

    #--- update region ^

  ItemVM : ItemVM