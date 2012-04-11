(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(["Ural/Modules/pubSub", "Ural/Models/itemVM"], function(pubSub, itemVM) {
    var IndexVM;
    IndexVM = (function() {

      function IndexVM(typeName, model, mappingRules) {
        var _this = this;
        this.typeName = typeName;
        this.mappingRules = mappingRules;
        this.remove = __bind(this.remove, this);
        this.detail = __bind(this.detail, this);
        this.edit = __bind(this.edit, this);
        this.list = ko.observableArray(model.map(function(m) {
          return new itemVM.ItemVM(_this.typeName, m, _this.mappingRules);
        }));
        this.active = ko.observable();
        pubSub.subOnce("model", "list_changed", this.typeName, function(data) {
          if (data.changeType === "added" && _u.getClassName(data.item) === _this.typeName) {
            return _this.onAdd(new itemVM.ItemVM(_this.typeName, data.item, _this.mappingRules));
          }
        });
      }

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
        if (!this._checkEventHandler(event, "remove")) return;
        event.preventDefault();
        return this.onRemove(viewModel);
      };

      IndexVM.prototype.onRemove = function(viewModel) {
        var _this = this;
        if (this.active()) this.active().cancel();
        return viewModel.remove(function(err) {
          if (!err) return _this.list.remove(viewModel);
        });
      };

      IndexVM.prototype.onAdd = function(viewModel) {
        return this.list.push(viewModel);
      };

      IndexVM.prototype.replaceAll = function(items) {
        var item, _i, _len, _results;
        this.list.removeAll();
        _results = [];
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          item = items[_i];
          _results.push(this.list.push(new itemVM.ItemVM(this.typeName, item, this.mappingRules)));
        }
        return _results;
      };

      return IndexVM;

    })();
    return {
      IndexVM: IndexVM
    };
  });

}).call(this);
