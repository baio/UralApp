(function() {

  define(function() {
    var ExpandOpts, FilterOpts, OrderBy;
    ExpandOpts = (function() {

      function ExpandOpts() {
        this.opts = [];
      }

      ExpandOpts.prototype.add = function(srcName, optName, expand) {
        if (srcName == null) srcName = "";
        return this.opts[srcName + ":" + optName] = expand;
      };

      ExpandOpts.prototype.remove = function(srcName, optName) {
        if (srcName == null) srcName = "";
        return delete this.opts[srcName + ":" + optName];
      };

      ExpandOpts.prototype.get = function(srcName, optName) {
        var res;
        res = this.opts[srcName + ":" + optName];
        return res != null ? res : res = this.opts[":" + optName];
      };

      return ExpandOpts;

    })();
    OrderBy = (function() {

      function OrderBy() {
        this._def = null;
      }

      OrderBy.prototype.def = function(d) {
        if (d !== void 0) this._def = d;
        return this._def;
      };

      return OrderBy;

    })();
    FilterOpts = (function() {

      function FilterOpts() {}

      FilterOpts.prototype.nullRefVal = function(val) {
        if (val !== void 0) this.nullRefVal = val;
        return this.nullRefVal;
      };

      FilterOpts.prototype.isNullRef = function(item) {
        return item.id === this.nullRefVal;
      };

      return FilterOpts;

    })();
    return {
      expandOpts: new ExpandOpts(),
      orderBy: new OrderBy(),
      filterOpts: new FilterOpts()
    };
  });

}).call(this);
