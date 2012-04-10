(function() {

  define(["Models/product", "Ural/Models/itemVM", "Ural/Modules/PubSub"], function(product, itemVM, pubSub) {
    var ItemToolbox;
    ItemToolbox = (function() {

      function ItemToolbox() {
        this.newProduct = ko.observable();
      }

      ItemToolbox.prototype.addProduct = function(data, event) {
        var ivm, vm,
          _this = this;
        event.preventDefault();
        vm = new product.ModelConstructor();
        ivm = new itemVM.ItemVM("Product", vm, product.mappingRules);
        ivm.edit(function() {
          pubSub.pub("model", "end_create", ivm.item);
          return _this.newProduct(ivm);
        });
        this.newProduct(ivm);
        return pubSub.pub("model", "create", vm);
      };

      return ItemToolbox;

    })();
    return {
      itemToolbox: new ItemToolbox()
    };
  });

}).call(this);
