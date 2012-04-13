(function() {

  define(["Models/tag"], function(tag) {
    var Product, __metadata;
    Product = (function() {

      function Product() {
        this.id = ko.observable();
        this.name = ko.observable();
        this.Tags = ko.observableArray();
        this.Producer = ko.observable();
        this.comp = ko.computed((function() {
          return this.id() + " " + this.name() + "foo";
        }), this);
        ko.mapping.fromJS(__metadata.def, __metadata.mapping, this);
      }

      return Product;

    })();
    __metadata = {
      def: {
        id: -1,
        name: null,
        Tags: [],
        Producer: {
          id: __g.nullRefVal(),
          name: null
        }
      },
      mapping: {
        name: {
          update: function(opts) {
            return opts.data;
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
      }
    };
    return {
      ModelConstructor: Product,
      metadata: __metadata
    };
  });

}).call(this);
