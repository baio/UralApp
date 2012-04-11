define ["Ural/Models/indexVM", "Ural/Models/itemRefVM"], (indexVM, itemRefVM) ->

  class IndexRefVM extends indexVM.IndexVM

    constructor: (typeName, @src, mappingRules) ->
      @_freezeListSubscribe = true
      super typeName, @src(), mappingRules

      @src.subscribe (newVal) =>
        @replaceAll newVal

    onCreateItemVM: (item) ->
      new itemRefVM.ItemRefVM @typeName, item, @mappingRules

    onAdded: (viewModel) ->
      @src.push viewModel.item

    onRemoved: (viewModel) ->
      @src.remove viewModel.item

  IndexRefVM : IndexRefVM