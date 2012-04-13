(function() {

  define(["Models/product", "Models/producer", "Ural/Models/itemVM", "Ural/Modules/PubSub"], function(product, producer, itemVM, pubSub) {
    var IndexToolbox;
    IndexToolbox = (function() {

      function IndexToolbox() {
        this.newProduct = ko.observable();
        this.newProducer = ko.observable();
      }

      IndexToolbox.prototype._create = function(data, event, typeName, prop) {
        var ivm,
          _this = this;
        event.preventDefault();
        ivm = new itemVM.ItemVM(typeName);
        return ivm.map(null, true, function(err) {
          if (!err) {
            ivm.edit(function() {
              ivm.endEdit();
              pubSub.pub("model", "end_create", ivm.item);
              return prop(ivm);
            });
            prop(ivm);
            return pubSub.pub("model", "create", ivm.item);
          }
        });
      };

      IndexToolbox.prototype.createProduct = function(data, event) {
        return this._create(data, event, "Product", this.newProduct);
      };

      IndexToolbox.prototype.createProducer = function(data, event) {
        return this._create(data, event, "Producer", this.newProducer);
      };

      return IndexToolbox;

    })();
    return {
      indexToolbox: new IndexToolbox()
    };
  });

}).call(this);
