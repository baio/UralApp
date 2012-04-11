define ["Ural/Models/IndexVM", "Ural/Models/ItemVM"], (indexVM, itemVM) ->

  class IndexRefVM extends indexVM.IndexVM

    constructor: (typeName, @src, mappingRules) ->
      super typeName, @src(), mappingRules
      @src.subscribe (newVal) =>
        @replaceAll newVal
        #@pushArray newVal
      ###
      @list.subscribe =>
        for listItem in @list()
          #exists in list but not in src - append to src
          if ! ko.utils.arrayFirst(@src(), (item) -> item == listItem.item)
            @src.push listItem.item
        for item in @src()
          #exists in src but not in list - remove to src
          if ! ko.utils.arrayFirst(@list(), (listItem) -> item == listItem.item)
            @src.remove listItem.item
      ###

    onRemove: (viewModel) ->
      @src.remove viewModel.item

    onAdd: (viewModel) ->
      @src.push viewModel.item


  IndexRefVM : IndexRefVM