(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(["Ural/Modules/pubSub", "Ural/Models/itemVM"], function(pubSub, itemVM) {
    var IndexVM;
    IndexVM = (function() {

      function IndexVM(typeName) {
        var _this = this;
        this.typeName = typeName;
        this.remove = __bind(this.remove, this);
        this.detail = __bind(this.detail, this);
        this.edit = __bind(this.edit, this);
        this.active = ko.observable();
        this.list = ko.observableArray();
        pubSub.subOnce("model", "list_changed", this.typeName, function(data) {
          var fromList;
          if (data.changeType === "added") {
            if (_u.getClassName(data.itemVM.item) === _this.typeName) {
              fromList = _this.list().filter(function(i) {
                return i.item === data.itemVM.item;
              })[0];
              if (!fromList) return _this.onAdded(data.itemVM);
            }
          } else if (data.changeType === "removed") {
            if (_u.getClassName(data.itemVM.item) === _this.typeName) {
              return _this.onRemoved(data.itemVM);
            }
          }
        });
      }

      IndexVM.prototype.map = function(data, onDone) {
        var _this = this;
        return async.mapSeries(data, function(d, ck) {
          var item;
          item = _this.onCreateItemVM();
          return item.map(d, true, ck);
        }, function(err, ivms) {
          var ivm, _i, _len;
          if (!err) {
            _this.list.removeAll();
            for (_i = 0, _len = ivms.length; _i < _len; _i++) {
              ivm = ivms[_i];
              _this.list.push(ivm);
            }
          }
          return onDone(err, _this);
        });
      };

      IndexVM.prototype.onCreateItemVM = function() {
        return new itemVM.ItemVM(this.typeName);
      };

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
        /*
              @active viewModel
              viewModel.edit()
        */
        return pubSub.pub("model", "detail", viewModel.item);
      };

      IndexVM.prototype.remove = function(viewModel, event) {
        if (!this._checkEventHandler(event, "remove")) return;
        event.preventDefault();
        return this.onRemove(viewModel);
      };

      IndexVM.prototype.onRemove = function(viewModel) {
        if (this.active()) this.active().cancel();
        return viewModel.remove();
      };

      IndexVM.prototype.onAdded = function(viewModel) {
        return this.list.push(viewModel);
      };

      IndexVM.prototype.onRemoved = function(viewModel) {
        return this.list.remove(viewModel);
      };

      IndexVM.prototype.replaceAll = function(items) {
        var item, _i, _len, _results;
        this.list.removeAll();
        _results = [];
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          item = items[_i];
          _results.push(this.list.push(this.onCreateItemVM(item)));
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
