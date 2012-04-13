define ["Ural/Models/itemVM"], (itemVM) ->

  class ItemRefVM extends itemVM.ItemVM

    constructor: (@indexRefVM, typeName, item, mappingRules) ->
      super typeName, item, mappingRules

    ###
    save: (data, event, saveMode) ->
      if saveMode == "whole"
        @indexRefVM.parentItemVM.save()
      else
        super data, event
    ###

    onUpdate: (item, state, onDone) ->
      onDone null, item

    onRemove: (item, onDone) ->
      onDone null, item

  ItemRefVM : ItemRefVM