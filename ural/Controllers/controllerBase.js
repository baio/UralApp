(function() {

  define(function() {
    var ControllerBase;
    ControllerBase = (function() {

      function ControllerBase() {}

      ControllerBase.prototype.index = function() {};

      ControllerBase.prototype.details = function(id) {};

      ControllerBase.prototype.edit = function(id) {};

      return ControllerBase;

    })();
    return {
      ControllerBase: ControllerBase
    };
  });

}).call(this);
