(function() {

  define(["Models/product", "Ural/Models/indexRefVM"], function(product, indexRefVM) {
    var Producer, def, mappingRules;
    Producer = (function() {

      function Producer() {
        this.id = ko.observable();
        this.name = ko.observable();
        this.Products = ko.observableArray();
        this.ProductsVM = new indexRefVM.IndexRefVM({
          item: this,
          typeName: "Producer"
        }, "Product", this.Products, product.mappingRules);
        ko.mapping.fromJS(def(), mappingRules(), this);
        /*
              @__metadata =
                mapping : product.mappingRules
                def :
                  id : -1
                  name : null
                  Products : []
                viewModels : [
                      {
                        name : "ProductsVM"
                        typeName : "Product"
                        field : @Products
                        mapping : product.mappingRules
                      }
                    ]
        */
      }

      return Producer;

    })();
    mappingRules = function() {
      return {
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
      };
    };
    def = function() {
      return {
        id: -1,
        name: null,
        Products: []
      };
    };
    return {
      ModelConstructor: Producer,
      mappingRules: mappingRules()
    };
  });

}).call(this);
