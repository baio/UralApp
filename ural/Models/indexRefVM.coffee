define ["Ural/Models/indexVM", "Ural/Models/itemRefVM"], (indexVM, itemRefVM) ->

  class IndexRefVM extends indexVM.IndexVM

    constructor: (typeName, @src, mappingRules) ->

      super typeName, @src(), mappingRules

      @src.subscribe (newVal) =>
        @replaceAll newVal

    onCreateItem: (item) ->
      new itemRefVM.itemRefVM @typeName, item, @mappingRules

    onAdd: (viewModel) ->
      @src.push viewModel.item

    onRemove: (viewModel) ->
      @src.remove viewModel.item

  IndexRefVM : IndexRefVM