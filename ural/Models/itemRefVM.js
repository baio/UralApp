(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["Ural/Models/itemVM"], function(itemVM) {
    var ItemRefVM;
    ItemRefVM = (function(_super) {

      __extends(ItemRefVM, _super);

      function ItemRefVM(indexRefVM, typeName, item, mappingRules) {
        this.indexRefVM = indexRefVM;
        ItemRefVM.__super__.constructor.call(this, typeName, item, mappingRules);
      }

      /*
          save: (data, event, saveMode) ->
            if saveMode == "whole"
              @indexRefVM.parentItemVM.save()
            else
              super data, event
      */

      ItemRefVM.prototype.onUpdate = function(item, state, onDone) {
        return onDone(null, item);
      };

      ItemRefVM.prototype.onRemove = function(item, onDone) {
        return onDone(null, item);
      };

      return ItemRefVM;

    })(itemVM.ItemVM);
    return {
      ItemRefVM: ItemRefVM
    };
  });

}).call(this);
