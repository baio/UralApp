(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["Controllers/controllerBase"], function(controllerBase) {
    var ProducerController;
    ProducerController = (function(_super) {

      __extends(ProducerController, _super);

      function ProducerController(opts) {
        ProducerController.__super__.constructor.call(this, "Producer", opts);
      }

      return ProducerController;

    })(controllerBase.ControllerBase);
    return {
      ProducerController: ProducerController
    };
  });

}).call(this);
