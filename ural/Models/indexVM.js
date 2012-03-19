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

      IndexVM.prototype.edit = function(viewModel, event) {
        var _this = this;
        event.preventDefault();
        this.active(viewModel);
        viewModel.edit(function() {
          viewModel.endEdit();
          return _this.active(null);
        });
        return pubSub.pub("model", "edit", viewModel.item);
      };

      IndexVM.prototype.details = function(id) {};

      return IndexVM;

    })();
    return {
      IndexVM: IndexVM
    };
  });

}).call(this);
