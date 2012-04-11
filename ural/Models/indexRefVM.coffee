define ["Ural/Models/IndexVM", "Ural/Models/ItemVM"], (indexVM, itemVM) ->

  class IndexRefVM extends indexVM.IndexVM

    constructor: (typeName, @src, mappingRules) ->
      super typeName, @src(), mappingRules
      @src.subscribe (newVal) =>
        @replaceAll newVal

    onRemove: (viewModel) ->
      @src.remove viewModel.item

    onAdd: (viewModel) ->
      @src.push viewModel.item


  IndexRefVM : IndexRefVM