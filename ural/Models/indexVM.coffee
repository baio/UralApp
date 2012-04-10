define ["Ural/Modules/pubSub", "Ural/Models/itemVM"], (pubSub, itemVM) ->

  class IndexVM

    constructor: (@typeName, model, @mappingRules) ->
      @list = ko.observableArray model.map (m) -> new itemVM.ItemVM @tyepName, m, @mappingRules
      @active = ko.observable()

      pubSub.subOnce "model", "list_changed", @typeName, (data) =>
        if data.changeType == "added" and _u.getClassName(data.item) == @typeName
          @list.push new itemVM.ItemVM @typeName, data.item, @mappingRules

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
      if @active()
        @active().cancel()
      pubSub.pub "model", "remove", viewModel, (err) =>
        if !err then @list.remove viewModel

    find: (item) ->
      ko.utils.arrayFirst @list(), (listItem) -> item == listItem.item

    push: (item) ->
      ivm = @find item
      if !ivm
        ivm = new itemVM.ItemVM @typeName, item, @mappingRules
        @list.push ivm
      ivm

    pushArray: (items) ->
      @push item for item in items

  IndexVM : IndexVM