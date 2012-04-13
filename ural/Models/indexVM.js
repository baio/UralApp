(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(["Ural/Modules/pubSub", "Ural/Models/itemVM"], function(pubSub, itemVM) {
    var IndexVM;
    IndexVM = (function() {

      function IndexVM(typeName, list) {
        var _this = this;
        this.typeName = typeName;
        this.remove = __bind(this.remove, this);
        this.detail = __bind(this.detail, this);
        this.edit = __bind(this.edit, this);
        this.active = ko.observable();
        this.list = !list ? ko.observableArray() : list;
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
          if (!err) _this._updateList(ivms);
          return onDone(err, _this);
        });
      };

      IndexVM.prototype._updateList = function(items) {
        var ivm, _i, _len, _results;
        this.list.removeAll();
        _results = [];
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          ivm = items[_i];
          _results.push(this.list.push(ivm));
        }
        return _results;
      };

      IndexVM.prototype.onCreateItemVM = function(item) {
        return new itemVM.ItemVM(this.typeName, item);
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
        var _this = this;
        return this._updateList(items.map(function(i) {
          var vm;
          vm = _this.onCreateItemVM();
          vm.item = i;
          return vm;
        }));
        /*
              async.map items
                ,(i, ck) =>
                  vm = @onCreateItemVM()
                  vm.item = i
                  vm.map d, true, ck
                  #----
                ,(err, items) =>
                  if !err then @_updateList items
                  if onDone then onDone err, @
        */
      };

      return IndexVM;

    })();
    return {
      IndexVM: IndexVM
    };
  });

}).call(this);
