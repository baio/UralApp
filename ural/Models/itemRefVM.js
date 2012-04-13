(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["Ural/Models/itemVM"], function(itemVM) {
    var ItemRefVM;
    ItemRefVM = (function(_super) {

      __extends(ItemRefVM, _super);

      function ItemRefVM(indexRefVM, typeName) {
        this.indexRefVM = indexRefVM;
        ItemRefVM.__super__.constructor.call(this, typeName);
      }

      /*
          save: (data, event, saveMode) ->
            if saveMode == "whole"
              @indexRefVM.parentItemVM.save()
            else
              super data, event
      */

      ItemRefVM.prototype.onUpdate = function(state, onDone) {
        return onDone(null, this.item);
      };

      ItemRefVM.prototype.onRemove = function(onDone) {
        return onDone(null, this.item);
      };

      return ItemRefVM;

    })(itemVM.ItemVM);
    return {
      ItemRefVM: ItemRefVM
    };
  });

}).call(this);
