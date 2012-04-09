define ["Ural/Modules/pubSub", "Ural/Models/itemVM"], (pubSub, itemVM) ->

  class IndexVM

    constructor: (@typeName, model, mappingRules) ->
      @list = ko.observableArray model.map (m) -> new itemVM.ItemVM @tyepName, m, mappingRules
      @active = ko.observable()

      pubSub.subOnce "model", "list_changed", @modelName, (data) =>
        console.log "list_changed"
        console.log model
        if data.changeType == "added"
          @list.push new itemVM.ItemVM @tyepName, data.item, mappingRules

    ###
    console.log model
    console.log name
    if @typeName == name
      item = ko.utils.arrayFirst @list(), (item) -> item.id() == model.id()
      if !item then @list.push new itemVM.ItemVM @tyepName, m, mappingRules
    ###


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

  IndexVM : IndexVM