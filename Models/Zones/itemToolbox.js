(function() {

  define(["Models/product", "Ural/Models/itemRefVM", "Ural/Modules/PubSub"], function(product, itemRefVM, pubSub) {
    var ItemToolbox;
    ItemToolbox = (function() {

      function ItemToolbox() {
        this.newProduct = ko.observable();
      }

      ItemToolbox.prototype.addProduct = function(data, event, indexRefVM) {
        var ivm, vm,
          _this = this;
        event.preventDefault();
        vm = new product.ModelConstructor();
        ivm = new itemRefVM.ItemRefVM(indexRefVM, "Product", vm, product.mappingRules);
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
