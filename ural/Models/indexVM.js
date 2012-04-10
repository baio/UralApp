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
          return new itemVM.ItemVM(this.tyepName, m, this.mappingRules);
        }));
        this.active = ko.observable();
        pubSub.subOnce("model", "list_changed", this.typeName, function(data) {
          if (data.changeType === "added" && _u.getClassName(data.item) === _this.typeName) {
            return _this.list.push(new itemVM.ItemVM(_this.typeName, data.item, _this.mappingRules));
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
        var _this = this;
        if (!this._checkEventHandler(event, "remove")) return;
        event.preventDefault();
        if (this.active()) this.active().cancel();
        return pubSub.pub("model", "remove", viewModel, function(err) {
          if (!err) return _this.list.remove(viewModel);
        });
      };

      IndexVM.prototype.find = function(item) {
        return ko.utils.arrayFirst(this.list(), function(listItem) {
          return item === listItem.item;
        });
      };

      IndexVM.prototype.push = function(item) {
        var ivm;
        ivm = this.find(item);
        if (!ivm) {
          ivm = new itemVM.ItemVM(this.typeName, item, this.mappingRules);
          this.list.push(ivm);
        }
        return ivm;
      };

      IndexVM.prototype.pushArray = function(items) {
        var item, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          item = items[_i];
          _results.push(this.push(item));
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
