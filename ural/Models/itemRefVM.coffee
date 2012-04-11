define ["Ural/Models/itemVM"], (itemVM) ->

  class ItemRefVM extends itemVM.ItemVM

    constructor: (typeName, item, mappingRules) ->
      super typeName, item, mappingRules

    onUpdate: (item, remove, onDone) ->
      onDone null, item

    onRemove: (item, onDone) ->
      onDone null, item

  ItemRefVM : ItemRefVM