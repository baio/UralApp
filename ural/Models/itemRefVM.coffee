define ["Ural/Models/itemVM"], (itemVM) ->

  class ItemRefVM extends itemVM.ItemVM

    constructor: (@indexRefVM, typeName) ->
      super typeName

    ###
    save: (data, event, saveMode) ->
      if saveMode == "whole"
        @indexRefVM.parentItemVM.save()
      else
        super data, event
    ###

    onUpdate: (state, onDone) ->
      onDone null, @item

    onRemove: (onDone) ->
      onDone null, @item

  ItemRefVM : ItemRefVM