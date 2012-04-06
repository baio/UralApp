(function() {

  define(["Models/product", "Ural/Models/itemVM", "Ural/Modules/PubSub"], function(product, itemVM, pubSub) {
    var IndexToolbox, indexToolbox;
    IndexToolbox = (function() {

      function IndexToolbox() {
        this.newProduct = ko.observable();
      }

      IndexToolbox.prototype.createProduct = function(data, event) {
        var ivm, vm,
          _this = this;
        event.preventDefault();
        vm = new product.ModelConstructor();
        ivm = new itemVM.ItemVM(vm, product.mappingRules);
        ivm.edit(function() {
          pubSub.pub("model", "end_create", ivm.item);
          return _this.newProduct(ivm);
        });
        this.newProduct(ivm);
        return pubSub.pub("model", "create", vm);
      };

      return IndexToolbox;

    })();
    indexToolbox = new IndexToolbox();
    return {
      indexToolbox: indexToolbox
    };
  });

}).call(this);
