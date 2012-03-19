(function() {

  define(function() {
    var Product, mappingRules;
    Product = (function() {

      function Product() {
        this.id = ko.observable();
        this.name = ko.observable();
        this.comp = ko.computed((function() {
          return this.id() + " " + this.name();
        }), this);
        this.tags = ko.observableArray();
      }

      return Product;

    })();
    mappingRules = function() {
      return {
        name: {
          update: function(opts) {
            return opts.data + "foo";
          }
        }
      };
    };
    return {
      ModelConstructor: Product,
      mappingRules: mappingRules()
    };
  });

}).call(this);
