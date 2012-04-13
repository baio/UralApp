(function() {
  var __hasProp = Object.prototype.hasOwnProperty;

  define(["Ural/Modules/DataProvider", "Ural/Modules/PubSub", "Ural/Models/indexVM"], function(dataProvider, pubSub, indexVM) {
    var ItemVM;
    ItemVM = (function() {

      function ItemVM(typeName) {
        this.typeName = typeName;
        this.originItem = null;
        this.modelModule = null;
      }

      ItemVM.prototype.map = function(data, ini, onDone) {
        var _this = this;
        return require(["Models/" + (this.typeName.toLowerCase())], function(module) {
          var meta, viewModel, _i, _len, _ref;
          meta = module.metadata;
          if (!meta) throw "not impl: meta must be defined";
          if (!meta.mapping) throw "not impl: mapping must be defined";
          if (!meta.def) throw "not impl: def must be defined";
          if (!data && !ini) throw "data arg must be provided";
          if (ini) {
            _this.item = new module.ModelConstructor();
            ko.mapping.fromJS((data ? data : meta.def), meta.mapping, _this.item);
            if (meta.viewModels) {
              _ref = meta.viewModels;
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                viewModel = _ref[_i];
                _this[viewModel.name] = new indexRefVM.IndexRefVM(_this, viewModel.typeName, viewModel.field);
              }
            }
          } else {
            ko.mapping.fromJS(data, meta.mapping, _this.item);
          }
          return onDone(null, _this);
        });
      };

      ItemVM.prototype._createOrigin = function() {
        return this.originItem = ko.mapping.toJS(this.item);
      };

      ItemVM.prototype._copyFromOrigin = function() {
        return ko.mapping.fromJS(this.originItem, this.mappingRules, this.item);
      };

      ItemVM.prototype.getState = function() {
        return ItemVM._getState(this.originItem, this.item);
      };

      ItemVM._getState = function(item, observItem) {
        var prop, r, removed, res, val, _i, _len, _val;
        res = {};
        for (prop in item) {
          if (!__hasProp.call(item, prop)) continue;
          val = item[prop];
          _val = observItem[prop]();
          if (prop === "id") {
            res.id = val;
            if (val !== _val) {
              if (_val === __g.nullRefVal()) {
                res.__status = "removed";
                return res;
              } else {
                res[prop] === "modifyed";
              }
            }
          } else if (Array.isArray(val)) {
            removed = val.filter(function(v) {
              return ko.utils.arrayFirst(_val, function(i) {
                return i.id() === v.id;
              }) === null;
            }).map(function(v) {
              return v.id;
            });
            res[prop] = _val.map(function(v) {
              return ItemVM._getState(val.filter(function(f) {
                return f.id === v.id();
              })[0], v);
            });
            for (_i = 0, _len = removed.length; _i < _len; _i++) {
              r = removed[_i];
              res[prop].push({
                id: r,
                __status: "removed"
              });
            }
          } else if (typeof val === "object") {
            res[prop] = ItemVM._getState(val, _val);
          } else {
            res[prop] = val !== _val ? "modifyed" : "unchanged";
          }
        }
        return res;
      };

      ItemVM.prototype.edit = function(onDone) {
        this.onDone = onDone;
        if (this.originItem) throw "item already in edit state";
        return this._createOrigin();
      };

      ItemVM.prototype.endEdit = function() {
        if (!this.originItem) throw "item not in edit state";
        this.originItem = null;
        if (this.onDone) return this.onDone = null;
      };

      ItemVM.prototype.cancel = function() {
        return this._done(true);
      };

      ItemVM.prototype.save = function(data, event) {
        event.preventDefault();
        return this._done(false);
      };

      ItemVM.prototype._done = function(isCancel) {
        var isAdded,
          _this = this;
        if (!this.originItem) throw "item not in edit state";
        if (isCancel) {
          this._copyFromOrigin();
          if (this.onDone) return this.onDone(null, true);
        } else {
          isAdded = this.item.id() === -1;
          return this.update(function(err) {
            if (!err) {
              _this._createOrigin();
              if (isAdded) {
                pubSub.pub("model", "list_changed", {
                  itemVM: _this,
                  changeType: "added",
                  isExternal: false
                });
              }
            }
            if (_this.onDone) return _this.onDone(err, false);
          });
        }
      };

      ItemVM.prototype.update = function(onDone) {
        return this.onUpdate(this.getState(), onDone);
      };

      ItemVM.prototype.remove = function(onDone) {
        var _this = this;
        return this.onRemove(function(err) {
          if (!err) {
            pubSub.pub("model", "list_changed", {
              itemVM: _this,
              changeType: "removed",
              isExternal: false
            });
          }
          if (onDone) return onDone(err, _this.item);
        });
      };

      ItemVM.prototype._mapToData = function() {
        return ko.mapping.toJS(this.item);
      };

      ItemVM.prototype.onUpdate = function(state, onDone) {
        var dataForSave,
          _this = this;
        dataForSave = this._mapToData();
        dataForSave.__state = state;
        return async.waterfall([
          function(ck) {
            return _this.onSave(_this.typeName, dataForSave, ck);
          }, function(data, ck) {
            return _this.map(data, false, ck);
          }
        ], onDone);
      };

      ItemVM.prototype.onRemove = function(onDone) {
        return dataProvider.get()["delete"](this.typeName, this.item.id(), onDone);
      };

      ItemVM.prototype.onSave = function(typeName, dataForSave, onDone) {
        return dataProvider.get().save(typeName, dataForSave, onDone);
      };

      return ItemVM;

    })();
    return {
      ItemVM: ItemVM
    };
  });

}).call(this);
