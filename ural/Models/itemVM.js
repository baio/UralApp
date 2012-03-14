(function() {

  define(function() {
    var ItemVM;
    ItemVM = (function() {

      function ItemVM(item) {
        this.item = item;
      }

      ItemVM.prototype.update = function() {};

      return ItemVM;

    })();
    return {
      ItemVM: ItemVM
    };
  });

}).call(this);
