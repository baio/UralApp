(function() {
  var __hasProp = Object.prototype.hasOwnProperty;

  define(["Ural/Modules/ODataProvider", "Ural/Modules/WebSqlProvider", "Ural/Models/indexVM", "Ural/Modules/pubSub"], function(odataProvider, webSqlProvider, indexVM, pubSub) {
    var ControllerBase;
    ControllerBase = (function() {

      function ControllerBase(modelName, opts) {
        var _this = this;
        this.modelName = modelName;
        this.opts = opts;
        if (this.modelName == null) this.modelName = this._getControllerName();
        this._dataProviders = _u.toHashTable(this.onCreateDataProviders());
        this.defaultDataProviderName = _u.firstKey(this._dataProviders);
        pubSub.sub("model", "edit", function(model, name) {
          if (_this._isOwnModel(model)) return _this.onShowForm("edit");
        });
        pubSub.sub("model", "save", function(data, name, callback) {
          if (_this._isOwnModel(data.item)) {
            return _this.onSave(data.item, data.remove, callback);
          }
        });
      }

      ControllerBase.prototype.onCreateDataProviders = function() {
        return [
          {
            name: "odata",
            provider: odataProvider.dataProvider
          }, {
            name: "websql",
            provider: webSqlProvider.dataProvider
          }
        ];
      };

      ControllerBase.prototype._getModelModule = function(callback) {
        var customModelPath, useCustomModel;
        if (this.opts && this.opts.model) {
          useCustomModel = this.opts.model.useCustomModel;
          customModelPath = this.opts.model.customModelPath;
        }
        if (customModelPath == null) customModelPath = "Models/" + this.modelName;
        return require([customModelPath], function(module) {
          return callback(null, module);
        });
      };

      ControllerBase.prototype._isOwnModel = function(model) {
        return _u.getClassName(model) === this.modelName;
      };

      ControllerBase.prototype._mapToItems = function(data, modelModule) {
        return data.map(function(d) {
          return ko.mapping.fromJS(d, modelModule.mappingRules, new modelModule.ModelConstructor());
        });
      };

      ControllerBase.prototype._updateItem = function(data, item, modelModule) {
        return ko.mapping.fromJS(data, modelModule.mappingRules, item);
      };

      ControllerBase.prototype._mapToData = function(item, modelModule) {
        return ko.mapping.toJS(item);
      };

      ControllerBase.prototype.onShowForm = function(type) {
        return $("[data-form-model-type='" + this.modelName + "'][data-form-type='" + type + "']").show();
      };

      /*
          converge item, remove pair to a single object complyed to dataProvider.save
          i.e. removed item should be included in the updated object with {id : id, __action = "delete"}
      */

      ControllerBase._prepareDataForSave = function(item, remove) {
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
            ControllerBase._prepareDataForSave(item[prop], val);
          }
        }
        return res;
      };

      ControllerBase.prototype.onSave = function(item, remove, onDone) {
        var dataForSave,
          _this = this;
        if (Array.isArray(item)) throw "upade of multiple items is not supported!";
        dataForSave = ControllerBase._prepareDataForSave(this._mapToData(item), remove);
        return async.waterfall([
          function(ck) {
            return _this.getDataProvider().save(_this.modelName, dataForSave, ck);
          }, function(data, ck) {
            return _this._getModelModule(function(err, modelModule) {
              return ck(err, data, modelModule);
            });
          }
        ], function(err, data, modelModule) {
          return onDone(err, !err ? _this._updateItem(data, modelModule, item) : void 0);
        });
      };

      ControllerBase.prototype.getDataProvider = function(name) {
        if (name == null) name = this.defaultDataProviderName;
        return this._dataProviders[name];
      };

      ControllerBase.prototype.index = function(filter, onDone) {
        var _this = this;
        if (filter == null) filter = {};
        if (filter.$expand == null) filter.$expand = "$index";
        return async.waterfall([
          function(ck) {
            return _this.getDataProvider().load(_this.modelName, filter, ck);
          }, function(data, ck) {
            return _this._getModelModule(function(err, modelModule) {
              return ck(err, data, modelModule);
            });
          }, function(data, modelModule, ck) {
            var model, viewModel;
            model = _this._mapToItems(data, modelModule);
            viewModel = new indexVM.IndexVM(model, modelModule.mappingRules);
            return _this.view(viewModel, "index", null, function(err) {
              return ck(err, viewModel);
            });
          }
        ], onDone);
      };

      ControllerBase.prototype.view = function(viewModel, viewPath, layoutViewPath, onDone) {
        var bvp, lvp;
        lvp = this._prepareViewPath(layoutViewPath, "Shared/_layout");
        bvp = this._prepareViewPath(viewPath);
        return async.waterfall([
          function(ck) {
            return require(["Ural/text!" + lvp], function(layoutHtml) {
              return ck(null, layoutHtml);
            });
          }, function(layoutHtml, ck) {
            return require(["Ural/text!" + bvp], function(bodyHtml) {
              return ck(null, layoutHtml, bodyHtml);
            });
          }, function(layoutHtml, bodyHtml, ck) {
            $("#_layout").empty();
            $("#_layout").append(layoutHtml);
            $("#_body").append(bodyHtml);
            ko.applyBindings(viewModel);
            return ck();
          }
        ], function(err) {
          if (onDone) return onDone(err);
        });
      };

      ControllerBase.prototype._prepareViewPath = function(path, defPath) {
        var controllerName;
        if (path == null) path = defPath;
        if (path) {
          if (!path.match(/.*\.htm[l]?/)) path += ".html";
          if (!path.match(/^Views\/.*/)) {
            if (!path.match(/.*\/.*/)) {
              controllerName = this._getControllerName();
              return "Views/" + controllerName + "/" + path;
            } else {
              return "Views/" + path;
            }
          } else {
            return path;
          }
        }
      };

      ControllerBase.prototype._getControllerName = function() {
        return _u.getClassName(this).replace(/^(\w*)Controller$/, "$1");
      };

      return ControllerBase;

    })();
    return {
      ControllerBase: ControllerBase
    };
  });

}).call(this);
