(function() {
  var __hasProp = Object.prototype.hasOwnProperty;

  define(["Ural/Modules/PubSub"], function(pubSub) {
    var ItemVM;
    ItemVM = (function() {

      function ItemVM(item) {
        this.item = item;
        this.originItem = null;
      }

      ItemVM.prototype._createOrigin = function() {
        var prop, _ref, _results;
        this.originItem = {};
        _ref = this.item;
        _results = [];
        for (prop in _ref) {
          if (!__hasProp.call(_ref, prop)) continue;
          if (ko.isWriteableObservable(this.item[prop])) {
            _results.push(this.originItem[prop] = this.item[prop]());
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      ItemVM.prototype._copyFromOrigin = function() {
        var prop, _ref, _results;
        _ref = this.originItem;
        _results = [];
        for (prop in _ref) {
          if (!__hasProp.call(_ref, prop)) continue;
          _results.push(this.item[prop](this.originItem[prop]));
        }
        return _results;
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

      ItemVM.prototype.save = function() {
        return this._done(false);
      };

      ItemVM.prototype._done = function(isCancel) {
        if (!this.originItem) throw "item not in edit state";
        if (isCancel) {
          this._copyFromOrigin();
          if (this.onDone) return this.onDone(null, isCancel);
        } else {
          this._createOrigin();
          if (this.onDone) return this.onDone(null, isCancel);
          /*
                  pubSub.pub "model", "save", @item, (err) =>
                    if !err then @_createOrigin()
                    if @onDone then @onDone err, isCancel
          */
        }
      };

      return ItemVM;

    })();
    return {
      ItemVM: ItemVM
    };
  });

}).call(this);
