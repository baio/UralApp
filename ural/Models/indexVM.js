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

      IndexVM.prototype._clone = function(item) {
        return $.extend(true, {}, item);
      };

      IndexVM.prototype.edit = function(item, event) {
        var cloned;
        event.preventDefault();
        cloned = this._clone(item);
        this.active(cloned);
        return pubSub.pub("model", "edit", cloned);
      };

      IndexVM.prototype.details = function(id) {};

      return IndexVM;

    })();
    return {
      IndexVM: IndexVM
    };
  });

}).call(this);
