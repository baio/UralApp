(function() {

  define(["Models/product", "Ural/Models/itemVM"], function(product, itemVM) {
    var IndexToolbox, indexToolbox;
    IndexToolbox = (function() {

      function IndexToolbox() {
        this.newProduct = ko.observable();
      }

      IndexToolbox.prototype.createProduct = function(event) {
        var ivm, vm;
        event.preventDefault();
        vm = new product.ModelConstructor();
        ivm = new itemVM.ItemVM(vm, product.mappingRules);
        ivm.edit(function() {
          return this.newProduct(null);
        });
        return this.newProduct(ivm);
      };

      return IndexToolbox;

    })();
    indexToolbox = new IndexToolbox();
    return {
      indexToolbox: indexToolbox
    };
  });

}).call(this);
