(function() {

  define(function() {
    var ExpandOpts;
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
    return {
      expandOpts: new ExpandOpts()
    };
  });

}).call(this);
