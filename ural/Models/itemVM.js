(function() {
  var __hasProp = Object.prototype.hasOwnProperty;

  define(["Ural/Modules/PubSub"], function(pubSub) {
    var ItemVM;
    ItemVM = (function() {

      function ItemVM(item, mappingRules) {
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

      ItemVM.prototype.getRemoved = function() {
        return ItemVM._getRemoved(this.originItem, this.item);
      };

      ItemVM._getRemoved = function(origItem, curObservableItem) {
        var prop, removed, res, subRes, val;
        res = null;
        for (prop in origItem) {
          if (!__hasProp.call(origItem, prop)) continue;
          val = origItem[prop];
          if (Array.isArray(val)) {
            removed = val.filter(function(v) {
              return ko.utils.arrayFirst(curObservableItem[prop](), function(i) {
                return i.id() === v.id;
              }) === null;
            }).map(function(v) {
              return v.id;
            });
            if (removed.length) {
              if (res == null) res = {};
              res[prop] = removed;
            }
          } else if (typeof val === "object") {
            subRes = ItemVM._getRemoved(val, curObservableItem[prop]());
            if (subRes) res[prop] = subRes;
          }
        }
        return res;
      };

      ItemVM.prototype.edit = function(onDone) {
        this.onDone = onDone;
        if (this.originItem) throw "item already in edit state";
        this._createOrigin();
        return pubSub.pub("model", "edit", this.item);
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
        var data, remove,
          _this = this;
        if (!this.originItem) throw "item not in edit state";
        if (isCancel) {
          this._copyFromOrigin();
          if (this.onDone) return this.onDone(null, isCancel);
        } else {
          remove = this.getRemoved();
          if (remove == null) remove = {};
          data = {
            item: this.item,
            remove: remove
          };
          return pubSub.pub("model", "save", data, function(err, item) {
            if (!err) _this._createOrigin();
            if (_this.onDone) return _this.onDone(err, isCancel);
          });
        }
      };

      return ItemVM;

    })();
    return {
      ItemVM: ItemVM
    };
  });

}).call(this);
