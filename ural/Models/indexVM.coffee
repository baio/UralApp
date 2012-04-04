define ["Ural/Modules/pubSub", "Ural/Models/itemVM"], (pubSub, itemVM) ->

  class IndexVM
    constructor: (model, mappingRules) ->
      @list = model.map (m) -> new itemVM.ItemVM m, mappingRules
      @active = ko.observable()

    edit: (viewModel, event) =>
      event.preventDefault()
      @active viewModel
      viewModel.edit =>
        viewModel.endEdit()
        @active null
      pubSub.pub "model", "edit", viewModel.item

    details: (id) ->

  IndexVM : IndexVM