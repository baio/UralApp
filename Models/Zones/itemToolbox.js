(function() {

  define(["Models/product", "Ural/Models/itemRefVM", "Ural/Modules/PubSub"], function(product, itemRefVM, pubSub) {
    var ItemToolbox;
    ItemToolbox = (function() {

      function ItemToolbox() {
        this.newProduct = ko.observable();
      }

      ItemToolbox.prototype._add = function(data, event, indexRefVM, typeName, prop) {
        var ivm,
          _this = this;
        event.preventDefault();
        ivm = new itemRefVM.ItemRefVM(indexRefVM, typeName);
        return ivm.map(null, true, function(err) {
          if (!err) {
            ivm.edit(function() {
              pubSub.pub("model", "end_create", ivm.item);
              return prop(ivm);
            });
            prop(ivm);
            return pubSub.pub("model", "create", ivm.item);
          }
        });
      };

      ItemToolbox.prototype.addProduct = function(data, event, indexRefVM) {
        return this._add(data, event, indexRefVM, "Product", this.newProduct);
      };

      return ItemToolbox;

    })();
    return {
      itemToolbox: new ItemToolbox()
    };
  });

}).call(this);
