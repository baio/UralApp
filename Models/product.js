(function() {

  define(["Models/tag"], function(tag) {
    var Product, mappingRules;
    Product = (function() {

      function Product() {
        this.id = ko.observable();
        this.name = ko.observable();
        this.comp = ko.computed((function() {
          return this.id() + " " + this.name();
        }), this);
        this.Tags = ko.observableArray();
        this.Producer = ko.observable();
      }

      return Product;

    })();
    mappingRules = function() {
      return {
        name: {
          update: function(opts) {
            return opts.data + "foo";
          }
        },
        Tags: {
          update: function(opts) {
            return ko.mapping.fromJS(opts.data, tag.mappingRules, new tag.ModelConstructor());
          }
        },
        Producer: {
          update: function(opts) {
            return ko.mapping.fromJS(opts.data, tag.mappingRules, new tag.ModelConstructor());
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
