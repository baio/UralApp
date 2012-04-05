define ["Ural/Modules/pubSub", "Ural/Models/itemVM"], (pubSub, itemVM) ->

  class IndexVM
    constructor: (model, mappingRules) ->
      @list = model.map (m) -> new itemVM.ItemVM m, mappingRules
      @active = ko.observable()
      @zones = {}

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


  IndexVM : IndexVM