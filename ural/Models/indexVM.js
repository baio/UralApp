(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(["Ural/Modules/pubSub", "Ural/Models/itemVM"], function(pubSub, itemVM) {
    var IndexVM;
    IndexVM = (function() {

      function IndexVM(typeName, model, mappingRules) {
        var _this = this;
        this.typeName = typeName;
        this.remove = __bind(this.remove, this);
        this.detail = __bind(this.detail, this);
        this.edit = __bind(this.edit, this);
        this.list = ko.observableArray(model.map(function(m) {
          return new itemVM.ItemVM(this.tyepName, m, mappingRules);
        }));
        this.active = ko.observable();
        this.zones = {};
        pubSub.subOnce("model", "list_changed", this.modelName, function(data) {
          console.log("list_changed");
          console.log(model);
          if (data.changeType === "added") {
            return _this.list.push(new itemVM.ItemVM(_this.tyepName, data.item, mappingRules));
          }
        });
      }

      /*
          console.log model
          console.log name
          if @typeName == name
            item = ko.utils.arrayFirst @list(), (item) -> item.id() == model.id()
            if !item then @list.push new itemVM.ItemVM @tyepName, m, mappingRules
      */

      IndexVM.prototype._checkEventHandler = function(event, name) {
        var eventHandler;
        eventHandler = $(event.target).attr("data-event-handler");
        return !eventHandler || eventHandler === name;
      };

      IndexVM.prototype.edit = function(viewModel, event) {
        var _this = this;
        if (!this._checkEventHandler(event, "edit")) return;
        event.preventDefault();
        if (this.active()) this.active().cancel();
        this.active(viewModel);
        viewModel.edit(function() {
          pubSub.pub("model", "end_edit", viewModel.item);
          viewModel.endEdit();
          return _this.active(null);
        });
        return pubSub.pub("model", "edit", viewModel.item);
      };

      IndexVM.prototype.detail = function(viewModel, event) {
        if (!this._checkEventHandler(event, "detail")) return;
        event.preventDefault();
        if (this.active()) this.active().cancel();
        this.active(viewModel);
        return pubSub.pub("model", "detail", viewModel.item);
      };

      IndexVM.prototype.remove = function(viewModel, event) {
        var _this = this;
        if (!this._checkEventHandler(event, "remove")) return;
        event.preventDefault();
        if (this.active()) this.active().cancel();
        return pubSub.pub("model", "remove", viewModel, function(err) {
          if (!err) return _this.list.remove(viewModel);
        });
      };

      return IndexVM;

    })();
    return {
      IndexVM: IndexVM
    };
  });

}).call(this);
