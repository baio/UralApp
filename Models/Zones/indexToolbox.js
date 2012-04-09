(function() {

  define(["Models/product", "Models/producer", "Ural/Models/itemVM", "Ural/Modules/PubSub"], function(product, producer, itemVM, pubSub) {
    var IndexToolbox;
    IndexToolbox = (function() {

      function IndexToolbox() {
        this.newProduct = ko.observable();
        this.newProducer = ko.observable();
      }

      IndexToolbox.prototype.createProduct = function(data, event) {
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

      IndexToolbox.prototype.createProducer = function(data, event) {
        var ivm, vm,
          _this = this;
        event.preventDefault();
        vm = new producer.ModelConstructor();
        ivm = new itemVM.ItemVM("Producer", vm, producer.mappingRules);
        ivm.edit(function() {
          pubSub.pub("model", "end_create", ivm.item);
          return _this.newProducer(ivm);
        });
        this.newProducer(ivm);
        return pubSub.pub("model", "create", vm);
      };

      return IndexToolbox;

    })();
    return {
      indexToolbox: new IndexToolbox()
    };
  });

}).call(this);
