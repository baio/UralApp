(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["Ural/Controllers/controllerBase", "Models/Zones/itemToolbox", "Models/Zones/indexToolbox"], function(controllerBase, itemToolbox, indexToolbox) {
    var ControllerBase;
    ControllerBase = (function(_super) {

      __extends(ControllerBase, _super);

      function ControllerBase(modelName, opts) {
        ControllerBase.__super__.constructor.call(this, modelName, opts);
        this.defaultIndexLayout = "Shared/__LayoutIndex";
        this.defaultItemLayout = "Shared/__LayoutItem";
      }

      ControllerBase.prototype.onCreateIndexViewModel = function(model, modelModule) {
        var vm;
        vm = ControllerBase.__super__.onCreateIndexViewModel.call(this, model, modelModule);
        vm.zones = {
          toolbox: indexToolbox.indexToolbox
        };
        return vm;
      };

      ControllerBase.prototype.onCreateItemViewModel = function(model, modelModule) {
        var vm;
        vm = ControllerBase.__super__.onCreateItemViewModel.call(this, model, modelModule);
        vm.zones = {
          toolbox: itemToolbox.itemToolbox
        };
        return vm;
      };

      ControllerBase.prototype.onShowForm = function($form) {
        return $form.modal('show');
      };

      ControllerBase.prototype.onHideForm = function($form) {
        return $form.modal('hide');
      };

      return ControllerBase;

    })(controllerBase.ControllerBase);
    return {
      ControllerBase: ControllerBase
    };
  });

}).call(this);
