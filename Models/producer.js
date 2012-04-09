(function() {

  define(["Models/product"], function(product) {
    var Producer, def, mappingRules;
    Producer = (function() {

      function Producer() {
        this.id = ko.observable();
        this.name = ko.observable();
        this.Products = ko.observable();
        ko.mapping.fromJS(def(), mappingRules(), this);
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
