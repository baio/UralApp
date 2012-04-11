(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["Ural/Models/IndexVM", "Ural/Models/ItemVM"], function(indexVM, itemVM) {
    var IndexRefVM;
    IndexRefVM = (function(_super) {

      __extends(IndexRefVM, _super);

      function IndexRefVM(typeName, src, mappingRules) {
        var _this = this;
        this.src = src;
        IndexRefVM.__super__.constructor.call(this, typeName, this.src(), mappingRules);
        this.src.subscribe(function(newVal) {
          return _this.replaceAll(newVal);
        });
      }

      IndexRefVM.prototype.onRemove = function(viewModel) {
        return this.src.remove(viewModel.item);
      };

      IndexRefVM.prototype.onAdd = function(viewModel) {
        return this.src.push(viewModel.item);
      };

      return IndexRefVM;

    })(indexVM.IndexVM);
    return {
      IndexRefVM: IndexRefVM
    };
  });

}).call(this);
