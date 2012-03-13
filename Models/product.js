(function() {

  define(function() {
    var Product;
    Product = (function() {

      function Product() {
        this.id = ko.observable();
        this.name = ko.observable();
      }

      return Product;

    })();
    return {
      Product: Product
    };
  });

}).call(this);
