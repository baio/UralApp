(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(["Ural/Modules/pubSub", "Ural/Models/itemVM"], function(pubSub, itemVM) {
    var IndexVM;
    IndexVM = (function() {

      function IndexVM(model) {
        this.edit = __bind(this.edit, this);        this.list = model.map(function(m) {
          return new itemVM.ItemVM(m);
        });
        this.active = ko.observable();
      }

      IndexVM.prototype.edit = function(item, event) {
        var _this = this;
        event.preventDefault();
        this.active(item);
        item.edit(function() {
          item.endEdit();
          return _this.active(null);
        });
        return pubSub.pub("model", "edit", item);
      };

      IndexVM.prototype.details = function(id) {};

      return IndexVM;

    })();
    return {
      IndexVM: IndexVM
    };
  });

}).call(this);
