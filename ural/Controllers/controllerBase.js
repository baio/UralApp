(function() {

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
        pubSub.sub("model", "save", function(model, name, callback) {
          if (_this._isOwnModel(model)) return _this.onSave(model, callback);
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

      ControllerBase.prototype._isOwnModel = function(model) {
        return _u.getClassName(model) === this.modelName;
      };

      ControllerBase.prototype._mapToItem = function(data, modelModule) {
        return data.map(function(d) {
          return ko.mapping.fromJS(d, modelModule.mappingRules, new modelModule.ModelConstructor());
        });
      };

      ControllerBase.prototype._mapToData = function(item, modelModule) {
        return ko.mapping.toJS(item);
      };

      ControllerBase.prototype.onShowForm = function(type) {
        return $("[data-form-model-type='" + this.modelName + "'][data-form-type='" + type + "']").show();
      };

      ControllerBase.prototype.onSave = function(item, callback) {
        var _this = this;
        return this.getDataProvider().save(this.modelName, this._mapToData(item), function(err, data) {
          if (callback) return callback(err, _this._mapToItem(data));
        });
      };

      ControllerBase.prototype.getDataProvider = function(name) {
        if (name == null) name = this.defaultDataProviderName;
        return this._dataProviders[name];
      };

      ControllerBase.prototype.index = function(filter, onDone) {
        var customModelPath, useCustomModel,
          _this = this;
        if (this.opts && this.opts.model) {
          useCustomModel = this.opts.model.useCustomModel;
          customModelPath = this.opts.model.customModelPath;
          if (customModelPath == null) {
            customModelPath = "Models/" + this.modelName;
          }
        }
        return async.waterfall([
          function(ck) {
            if (filter == null) filter = {};
            if (filter.$expand == null) filter.$expand = "$index";
            return _this.getDataProvider().load(_this.modelName, filter, ck);
          }, function(data, ck) {
            if (useCustomModel) {
              return require([customModelPath], function(modelModule) {
                return ck(null, _this._mapToItem(data, modelModule));
              });
            } else {
              return ck(null, data);
            }
          }
        ], function(err, model) {
          var viewModel;
          if (!err) {
            viewModel = new indexVM.IndexVM(model);
            return _this.view(viewModel, "index", null, function(err) {
              if (onDone) return onDone(err, viewModel);
            });
          } else {
            if (onDone) return onDone(err);
          }
        });
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
