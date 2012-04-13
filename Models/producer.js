(function() {

  define(["Models/product", "Ural/Models/indexRefVM"], function(product, indexRefVM) {
    var Producer, __metadata;
    Producer = (function() {

      function Producer() {
        this.id = ko.observable();
        this.name = ko.observable();
        this.Products = ko.observableArray();
        ko.mapping.fromJS(__metadata.def, __metadata.mapping, this);
      }

      return Producer;

    })();
    __metadata = {
      mapping: {
        name: {
          update: function(opts) {
            return opts.data;
          }
        },
        Products: {
          update: function(opts) {
            return ko.mapping.fromJS(opts.data, product.mappingRules, new product.ModelConstructor());
          }
        }
      },
      def: {
        id: -1,
        name: null,
        Products: []
      },
      viewModels: [
        {
          name: "ProductsVM",
          typeName: "Product",
          field: "Products",
          mapping: product.mappingRules
        }
      ]
    };
    return {
      ModelConstructor: Producer,
      metadata: __metadata
    };
  });

}).call(this);
