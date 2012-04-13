define ["Ural/Modules/pubSub", "Ural/Models/itemVM"], (pubSub, itemVM) ->

  class IndexVM

    constructor: (@typeName, list) ->
      @active = ko.observable()
      @list = if !list then ko.observableArray() else list
      pubSub.subOnce "model", "list_changed", @typeName, (data) =>
        if data.changeType == "added"
          if _u.getClassName(data.itemVM.item) == @typeName
            fromList = @list().filter((i)->i.item == data.itemVM.item)[0]
            if !fromList
              @onAdded data.itemVM
        else if data.changeType == "removed"
          if _u.getClassName(data.itemVM.item) == @typeName
            @onRemoved data.itemVM

    map: (data, onDone) ->
      async.mapSeries data
        , (d, ck) =>
          item = @onCreateItemVM()
          item.map d, true, ck
        , (err, ivms) =>
          if !err then @_updateList ivms
          onDone err, @

    _updateList: (items) ->
      @list.removeAll()
      @list.push ivm for ivm in items

    onCreateItemVM: (item)->
      new itemVM.ItemVM @typeName, item

    _checkEventHandler:(event, name) ->
      eventHandler = $(event.target).attr "data-event-handler"
      !eventHandler or eventHandler == name

    edit: (viewModel, event) =>
      if !@_checkEventHandler event, "edit" then return
      event.preventDefault()
      if @active()
        @active().cancel()
      @active viewModel
      viewModel.edit =>
        pubSub.pub "model", "end_edit", viewModel.item
        viewModel.endEdit()
        @active null
      pubSub.pub "model", "edit", viewModel.item

    detail: (viewModel, event) =>
      if !@_checkEventHandler event, "detail" then return
      event.preventDefault()
      if @active()
        @active().cancel()
      ###
      @active viewModel
      viewModel.edit()
      ###
      pubSub.pub "model", "detail", viewModel.item

    remove: (viewModel, event) =>
      if !@_checkEventHandler event, "remove" then return
      event.preventDefault()
      @onRemove viewModel

    onRemove: (viewModel) ->
      if @active()
        @active().cancel()
      viewModel.remove()

    onAdded: (viewModel) ->
      @list.push viewModel

    onRemoved: (viewModel) ->
      @list.remove viewModel

    replaceAll: (items) ->
      @_updateList items.map (i) =>
        vm = @onCreateItemVM()
        vm.item = i
        vm

      ###
      async.map items
        ,(i, ck) =>
          vm = @onCreateItemVM()
          vm.item = i
          vm.map d, true, ck
          #----
        ,(err, items) =>
          if !err then @_updateList items
          if onDone then onDone err, @
      ###

  IndexVM : IndexVM