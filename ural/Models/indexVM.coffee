define ["Ural/Modules/pubSub", "Ural/Models/itemVM"], (pubSub, itemVM) ->

  class IndexVM

    constructor: (@typeName, model, @mappingRules) ->
      @list = ko.observableArray model.map (m) => new itemVM.ItemVM @typeName, m, @mappingRules
      @active = ko.observable()

      pubSub.subOnce "model", "list_changed", @typeName, (data) =>
        if data.changeType == "added" and _u.getClassName(data.item) == @typeName
          @onAdd new itemVM.ItemVM @typeName, data.item, @mappingRules

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
      @active viewModel
      pubSub.pub "model", "detail", viewModel.item

    remove: (viewModel, event) =>
      if !@_checkEventHandler event, "remove" then return
      event.preventDefault()
      @onRemove viewModel

    onRemove: (viewModel) ->
      if @active()
        @active().cancel()
      viewModel.remove (err) =>
        if !err then @list.remove viewModel

    onAdd: (viewModel) ->
      @list.push viewModel

    replaceAll: (items) ->
      @list.removeAll()
      for item in items
        @list.push new itemVM.ItemVM @typeName, item, @mappingRules


  IndexVM : IndexVM