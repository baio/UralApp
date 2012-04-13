define ["Ural/Models/indexVM", "Ural/Models/itemRefVM"], (indexVM, itemRefVM) ->

  class IndexRefVM extends indexVM.IndexVM

    constructor: (@parentItemVM, typeName, @src) ->
      super typeName
      @replaceAll @src()
      @src.subscribe (newVal) =>
        @replaceAll newVal

    onCreateItemVM: (item) ->
      new itemRefVM.ItemRefVM @, @typeName, item

    onAdded: (viewModel) ->
      @src.push viewModel.item

    onRemoved: (viewModel) ->
      @src.remove viewModel.item

  IndexRefVM : IndexRefVM