(function() {

  define(function() {
    var IndexVM;
    IndexVM = (function() {

      function IndexVM(model, mapping) {
        this.model = model;
        this.mapping = mapping;
      }

      IndexVM.prototype.edit = function(id) {};

      IndexVM.prototype.details = function(id) {};

      return IndexVM;

    })();
    return {
      IndexVM: IndexVM
    };
  });

}).call(this);
