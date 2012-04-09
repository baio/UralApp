(function() {
  var __hasProp = Object.prototype.hasOwnProperty;

  define(["Ural/Modules/ODataProvider", "Ural/Modules/WebSqlProvider", "Ural/Models/indexVM", "Ural/Models/itemVM", "Ural/Modules/pubSub"], function(odataProvider, webSqlProvider, indexVM, itemVM, pubSub) {
    var ControllerBase;
    ControllerBase = (function() {

      function ControllerBase(modelName, opts) {
        var _this = this;
        this.modelName = modelName;
        this.opts = opts;
        if (this.modelName == null) this.modelName = this._getControllerName();
        this._dataProviders = _u.toHashTable(this.onCreateDataProviders());
        this.defaultDataProviderName = _u.firstKey(this._dataProviders);
        pubSub.subOnce("model", "edit", this.modelName, function(model, name) {
          if (_this._isOwnModel(model)) return _this._showForm(name);
        });
        pubSub.subOnce("model", "create", this.modelName, function(model, name) {
          if (_this._isOwnModel(model)) return _this._showForm(name);
        });
        pubSub.subOnce("model", "end_edit", this.modelName, function(model, name) {
          if (_this._isOwnModel(model)) return _this._hideForm("edit");
        });
        pubSub.subOnce("model", "end_create", this.modelName, function(model, name) {
          if (_this._isOwnModel(model)) return _this._hideForm("create");
        });
        pubSub.subOnce("model", "detail", this.modelName, function(model, name) {
          if (_this._isOwnModel(model)) return _this.onShowDetails(model);
        });
        pubSub.subOnce("model", "save", this.modelName, function(data, name, callback) {
          if (_this._isOwnModel(data.item)) {
            return _this.onSave(data.item, data.remove, callback);
          }
        });
        pubSub.subOnce("model", "remove", this.modelName, function(data, name, callback) {
          if (_this._isOwnModel(data.item)) {
            return _this.onDelete(data.item, callback);
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
        item.id(data.id);
        return ko.mapping.fromJS(data, modelModule.mappingRules, item);
      };

      ControllerBase.prototype._mapToData = function(item, modelModule) {
        return ko.mapping.toJS(item);
      };

      ControllerBase.prototype._showForm = function(type) {
        return this.onShowForm($("[data-form-model-type='" + this.modelName + "'][data-form-type='" + type + "']"));
      };

      ControllerBase.prototype.onShowForm = function($form) {
        return $form.show();
      };

      ControllerBase.prototype._hideForm = function(type) {
        return this.onHideForm($("[data-form-model-type='" + this.modelName + "'][data-form-type='" + type + "']"));
      };

      ControllerBase.prototype.onHideForm = function($form) {
        return $form.hide();
      };

      ControllerBase.prototype.onShowDetails = function(model) {
        return window.location.hash = "" + this.modelName + "/item/" + (model.id());
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
          } else if (val) {
            res[prop].id = val;
            res[prop].__action = "delete";
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
          if (!err) _this._updateItem(data, item, modelModule);
          return onDone(err, item);
        });
      };

      ControllerBase.prototype.onDelete = function(item, onDone) {
        if (Array.isArray(item)) {
          throw "delete of multiple items is not supported!";
        }
        return this.getDataProvider()["delete"](this.modelName, item.id(), onDone);
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
            viewModel = _this.onCreateIndexViewModel(model, modelModule);
            return _this.view(viewModel, "index", null, function(err) {
              return ck(err, viewModel);
            });
          }
        ], onDone);
      };

      ControllerBase.prototype.onCreateIndexViewModel = function(model, modelModule) {
        return new indexVM.IndexVM(this.modelName, model, modelModule.mappingRules);
      };

      ControllerBase.prototype.item = function(id, onDone) {
        var _this = this;
        return async.waterfall([
          function(ck) {
            return _this.getDataProvider().load(_this.modelName, {
              id: {
                $eq: id
              },
              $expand: "$item"
            }, ck);
          }, function(data, ck) {
            return _this._getModelModule(function(err, modelModule) {
              return ck(err, data, modelModule);
            });
          }, function(data, modelModule, ck) {
            var model, viewModel;
            model = _this._mapToItems(data, modelModule);
            viewModel = _this.onCreateItemViewModel(model[0], modelModule.mappingRules);
            return _this.view(viewModel, "item", null, function(err) {
              viewModel.edit();
              return ck(err, viewModel);
            });
          }
        ], onDone);
      };

      ControllerBase.prototype.onCreateItemViewModel = function(model, modelModule) {
        return new itemVM.ItemVM(this.modelName, model, modelModule.mappingRules);
      };

      ControllerBase.prototype.view = function(viewModel, viewPath, layoutViewPath, onDone) {
        var bvp, crName, lvp;
        crName = this._getControllerName();
        lvp = ControllerBase._prepareViewPath(crName, layoutViewPath, "Shared/_layout");
        bvp = ControllerBase._prepareViewPath(crName, viewPath);
        return async.waterfall([
          function(ck) {
            return require(["Ural/text!" + lvp], function(layoutHtml) {
              return ck(null, layoutHtml);
            });
          }, function(layoutHtml, ck) {
            return ControllerBase._renderPartialViews(crName, layoutHtml, ck);
          }, function(layoutHtml, ck) {
            return require(["Ural/text!" + bvp], function(bodyHtml) {
              return ck(null, layoutHtml, bodyHtml);
            });
          }, function(layoutHtml, bodyHtml, ck) {
            return ControllerBase._renderPartialViews(crName, bodyHtml, function(err, renderedBody) {
              return ck(err, layoutHtml, renderedBody);
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

      ControllerBase._renderPartialViews = function(controllerName, html, callback) {
        html = _u.wrapHtml(html);
        return ControllerBase.__renderPartialViews(controllerName, html, function(err, renderedHtml) {
          if (renderedHtml) renderedHtml = $(renderedHtml).html();
          return callback(err, renderedHtml);
        });
      };

      ControllerBase.__renderPartialViews = function(controllerName, html, callback) {
        var partialViews, paths;
        partialViews = $("[data-partial-view]", html);
        paths = partialViews.map(function(i, p) {
          return "Ural/text!" + (ControllerBase._prepareViewPath(controllerName, $(p).attr("data-partial-view")));
        });
        if (paths.length) {
          return require($.makeArray(paths), function() {
            var $h, $pratialViewTag, i, jViewBag, partialHtml, partialHtmls, viewBag, _len;
            partialHtmls = _u.argsToArray(arguments);
            for (i = 0, _len = partialHtmls.length; i < _len; i++) {
              partialHtml = partialHtmls[i];
              $h = $(html);
              $pratialViewTag = $h.find("[data-partial-view]:eq(" + i + ")");
              viewBag = $pratialViewTag.attr("data-partial-view-bag");
              $pratialViewTag.removeAttr("data-partial-view");
              $pratialViewTag.removeAttr("data-partial-view-bag");
              if (viewBag) {
                jViewBag = eval("(" + viewBag + ")");
                $.templates({
                  pvt: partialHtml
                });
                partialHtml = $.render.pvt(jViewBag);
              }
              $pratialViewTag.html(partialHtml);
              html = _u.wrapHtml($h.html());
            }
            return async.forEachSeries(partialHtmls, function(ph, ck) {
              return ControllerBase.__renderPartialViews(controllerName, html, function(err, renderedHtml) {
                html = renderedHtml;
                return ck(err);
              });
            }, function(err) {
              return callback(err, html);
            });
          });
        } else {
          return callback(null, html);
        }
      };

      ControllerBase._prepareViewPath = function(controllerName, path, defPath) {
        if (path == null) path = defPath;
        if (path) {
          if (!path.match(/.*\.htm[l]?/)) path += ".html";
          if (!path.match(/^Views\/.*/)) {
            if (!path.match(/.*\/.*/)) {
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
