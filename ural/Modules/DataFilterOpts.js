(function() {

  define(function() {
    var ExpandOpts;
    ExpandOpts = (function() {

      function ExpandOpts() {
        this.opts = [];
      }

      ExpandOpts.prototype.add = function(srcName, optName, expand) {
        return this.opts[srcName + ":" + optName] = expand;
      };

      ExpandOpts.prototype.remove = function(srcName, optName) {
        return delete this.opts[srcName + ":" + optName];
      };

      ExpandOpts.prototype.get = function(srcName, optName) {
        return this.opts[srcName + ":" + optName];
      };

      return ExpandOpts;

    })();
    return {
      expandOpts: new ExpandOpts()
    };
  });

}).call(this);
