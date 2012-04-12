(function() {
  var __hasProp = Object.prototype.hasOwnProperty;

  define(["Ural/Modules/DataProvider", "Ural/Modules/PubSub"], function(dataProvider, pubSub) {
    var ItemVM;
    ItemVM = (function() {

      function ItemVM(typeName, item, mappingRules) {
        this.typeName = typeName;
        this.item = item;
        this.mappingRules = mappingRules;
        this.originItem = null;
      }

      ItemVM.prototype._createOrigin = function() {
        return this.originItem = ko.mapping.toJS(this.item);
      };

      ItemVM.prototype._copyFromOrigin = function() {
        return ko.mapping.fromJS(this.originItem, this.mappingRules, this.item);
      };

      /*
          Append removed referrences (via comparison with original item)
      */

      /*
          getRemovedRefs: -> ItemVM._getRemovedRefs @originItem, @item
      
          @_getRemovedRefs: (origItem, curObservableItem) ->
            _setProp = (obj, prop, val) ->
              obj ?= {}
              obj[prop] = val
              obj
      
            res = null
            for own prop of origItem
              val = origItem[prop]
              if val == null or val == undefined then continue
              if Array.isArray val
                removed = val.filter((v) -> ko.utils.arrayFirst(curObservableItem[prop](), (i) -> i.id() == v.id) == null)
                  .map (v) -> v.id
                if removed.length
                  res = _setProp res, prop, removed
              else if typeof val == "object"
                obj = curObservableItem[prop]()
                curId = obj.id()
                if curId != val.id and curId == __g.nullRefVal()
                  res = _setProp res, prop, val.id
                else
                  subRes = ItemVM._getRemovedRefs val, obj
                  if subRes then res = _setProp res, prop, subRes
            res
      */

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
          return this.update(function(err, item) {
            if (!err) {
              _this._createOrigin();
              if (isAdded) {
                pubSub.pub("model", "list_changed", {
                  item: item,
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
        return this.onUpdate(this.item, this.getState(), onDone);
      };

      ItemVM.prototype.remove = function(onDone) {
        var _this = this;
        return this.onRemove(this.item, function(err) {
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

      ItemVM.prototype._getModelModule = function(callback) {
        return require(["Models/" + (this.typeName.toLowerCase())], function(module) {
          return callback(null, module);
        });
      };

      ItemVM.prototype._updateItem = function(data, item, modelModule) {
        item.id(data.id);
        return ko.mapping.fromJS(data, modelModule.mappingRules, item);
      };

      ItemVM.prototype._mapToData = function(item, modelModule) {
        return ko.mapping.toJS(item);
      };

      /*
          converge item, remove pair to a single object complyed to dataProvider.save
          i.e. removed item should be included in the updated object with {id : id, __action = "delete"}
      */

      ItemVM._prepareDataForSave = function(item, remove) {
        var id, prop, res, val, _i, _len;
        res = item;
        for (prop in item) {
          if (!__hasProp.call(item, prop)) continue;
          val = remove[prop];
          if (Array.isArray(val)) {
            for (_i = 0, _len = val.length; _i < _len; _i++) {
              id = val[_i];
              res[prop].push({
                id: id,
                __action: "delete"
              });
            }
          } else if (typeof val === "object") {
            ItemVM._prepareDataForSave(item[prop], val);
          } else if (val) {
            res[prop].id = val;
            res[prop].__action = "delete";
          }
        }
        return res;
      };

      ItemVM.prototype.onUpdate = function(item, state, onDone) {
        var dataForSave,
          _this = this;
        if (Array.isArray(item)) throw "upade of multiple items is not supported!";
        dataForSave = this._mapToData(item);
        dataForSave.__state = state;
        return async.waterfall([
          function(ck) {
            return dataProvider.get().save(_this.typeName, dataForSave, ck);
          }, function(data, ck) {
            return _this._getModelModule(function(err, modelModule) {
              return ck(err, data, modelModule);
            });
          }
        ], function(err, data, modelModule) {
          if (!err) _this._updateItem(data, item, modelModule);
          return onDone(err, item);
        });
      };

      ItemVM.prototype.onRemove = function(item, onDone) {
        if (Array.isArray(item)) {
          throw "delete of multiple items is not supported!";
        }
        return dataProvider.get()["delete"](this.typeName, item.id(), onDone);
      };

      return ItemVM;

    })();
    return {
      ItemVM: ItemVM
    };
  });

}).call(this);
