(function() {
  var __hasProp = Object.prototype.hasOwnProperty;

  define(["Ural/Modules/ODataFilter", "Ural/Modules/DataFilterOpts", "Ural/Libs/datajs"], function(fr, frOpts) {
    var ODataProvider;
    ODataProvider = (function() {

      function ODataProvider() {}

      ODataProvider.serviceHost = function() {
        return 'http://localhost:3360/Service.svc/';
      };

      ODataProvider._parse = function(item) {
        var arr, obj, prop;
        if (item === null || item === void 0 || typeof item !== "object") {
          return item;
        }
        if (item.results && Array.isArray(item.results)) arr = item.results;
        if (item.d && Array.isArray(item.d)) arr = item.d;
        if (Array.isArray(item)) arr = item;
        if (arr) {
          return arr.map(function(i) {
            return ODataProvider._parse(i);
          });
        }
        obj = {};
        for (prop in item) {
          if (!__hasProp.call(item, prop)) continue;
          if (prop === "__deferred") {
            if (_.str.endsWith(prop, "s")) {
              return [];
            } else {
              return {
                id: __g.nullRefVal()
              };
            }
          }
          if (prop !== "__metadata") obj[prop] = ODataProvider._parse(item[prop]);
        }
        return obj;
      };

      ODataProvider._isDelete = function(item) {
        return item && item.__state && item.__state.__status === "removed";
      };

      ODataProvider._formatRequest = function(name, item, metadata, parentName, parentId, parentContentId, totalCount) {
        var cid, data, expnads, flattered, i, isArrayProp, isDelete, ix, nested, prop, ref, res, states, typeName, val, _len;
        res = [];
        expnads = [];
        if (totalCount == null) totalCount = 1;
        cid = totalCount;
        isDelete = ODataProvider._isDelete(item);
        if (!isDelete) {
          flattered = {};
          for (prop in item) {
            if (!__hasProp.call(item, prop)) continue;
            val = item[prop];
            if (val !== null && typeof val !== "object" && !Array.isArray(val)) {
              flattered[prop] = val;
            }
          }
        }
        typeName = name.replace(/^(.*)s$/, "$1");
        isArrayProp = typeName !== name;
        if (!parentName) {
          if (isDelete) {
            data = {
              method: "DELETE",
              uri: "" + name + "s(" + item.id + ")"
            };
          } else {
            data = (function() {
              switch (item.id) {
                case -1:
                  return {
                    method: "POST",
                    uri: "" + name + "s"
                  };
                default:
                  return {
                    method: "PUT",
                    uri: "" + name + "s(" + item.id + ")"
                  };
              }
            })();
          }
        } else {
          parentName = parentName.replace(/^(.*)s$/, "$1");
          if (isDelete) {
            ref = !isArrayProp ? name : "" + typeName + "s(" + item.id + ")";
            data = {
              method: "DELETE",
              uri: "" + parentName + "s(" + parentId + ")/$links/" + ref
            };
          } else {
            if (item.id === __g.nullRefVal()) return res;
            ref = parentId === -1 ? "$" + parentContentId : "" + parentName + "s(" + parentId + ")";
            if (item.id !== -1) {
              /*here actual update of referenced item
              */
              res.push({
                headers: {
                  "Content-ID": cid
                },
                requestUri: "" + typeName + "s(" + item.id + ")",
                method: "PUT",
                data: flattered
              });
              cid++;
              /*here update link to referenced item
              */
              data = {
                method: (isArrayProp ? "POST" : "PUT"),
                uri: "" + ref + "/$links/" + name
              };
              flattered = {
                uri: "" + typeName + "s(" + item.id + ")"
              };
            } else {
              data = {
                method: "POST",
                uri: "" + ref + "/" + name
              };
            }
          }
        }
        res.push({
          headers: {
            "Content-ID": cid
          },
          requestUri: data.uri,
          method: data.method,
          data: flattered
        });
        totalCount += res.length;
        if (!isDelete) {
          for (prop in item) {
            if (!__hasProp.call(item, prop)) continue;
            if (prop === "__state" || prop === "__parent") continue;
            val = item[prop];
            if (Array.isArray(val)) {
              states = item.__state[prop];
              if (states) {
                val = val.concat(states.filter(function(v) {
                  return v.__status === "removed";
                }));
              }
              for (ix = 0, _len = val.length; ix < _len; ix++) {
                i = val[ix];
                if (states) i.__state = states[ix];
                nested = ODataProvider._formatRequest(prop, i, metadata, name, item.id, cid, totalCount);
                totalCount += nested.length;
                res = res.concat(nested);
              }
            } else if (val !== null && typeof val === "object") {
              val.__state = item.__state[prop];
              nested = ODataProvider._formatRequest(prop, val, metadata, name, item.id, cid, totalCount);
              totalCount += nested.length;
              res = res.concat(nested);
            }
          }
        }
        return res;
      };

      ODataProvider.prototype.load = function(srcName, filter, callback) {
        var stt;
        stt = this._getStatement(srcName, filter);
        return OData.read(stt, function(data) {
          return callback(null, ODataProvider._parse(data));
        });
      };

      ODataProvider.prototype._getStatement = function(srcName, filter) {
        return this._getSatementByODataFilter(srcName, fr.convert(filter));
      };

      ODataProvider.prototype._getExpand = function(srcName, expand) {
        var res;
        res = frOpts.expandOpts.get(srcName, expand);
        if (res === "") null;
        return res != null ? res : res = expand;
      };

      ODataProvider.prototype._getOrderBy = function(filter, orderby) {
        var singleItemFilter;
        singleItemFilter = filter.match(/^.*id eq .*$/);
        if (singleItemFilter) return null;
        return orderby != null ? orderby : orderby = frOpts.orderBy.def();
      };

      ODataProvider.prototype._getSatementByODataFilter = function(srcName, oDataFilter) {
        var expand, orderby;
        expand = this._getExpand(srcName, oDataFilter.$expand);
        orderby = this._getOrderBy(oDataFilter.$filter, oDataFilter.$orderby);
        return _u.urlAddSearch("" + (ODataProvider.serviceHost()) + srcName + "s", oDataFilter.$filter ? "$filter=" + oDataFilter.$filter : void 0, oDataFilter.$top ? "$top=" + oDataFilter.$top : void 0, oDataFilter.$skip ? "$skip=" + oDataFilter.$skip : void 0, expand ? "$expand=" + expand : void 0, orderby ? "$orderby=" + orderby : void 0);
      };

      ODataProvider._getMetadata = function(srcName, item) {
        return null;
      };

      ODataProvider._getSaveRequestData = function(srcName, item) {
        var parentId, parentTypeName, req;
        if (item.__parent) {
          parentId = item.__parent.id;
          parentTypeName = item.__parent.typeName;
        }
        req = ODataProvider._formatRequest(srcName, item, null, parentTypeName, parentId);
        req.sort(function(a, b) {
          return a.headers["Content-ID"] - b.headers["Content-ID"];
        });
        return {
          __batchRequests: [
            {
              __changeRequests: req
            }
          ]
        };
      };

      ODataProvider._parseSaveResponseData = function(data) {
        var batchResponse, changeResponse, res, _i, _j, _len, _len2, _ref, _ref2;
        res = [];
        _ref = data.__batchResponses;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          batchResponse = _ref[_i];
          _ref2 = batchResponse.__changeResponses;
          for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
            changeResponse = _ref2[_j];
            res.push({
              type: null,
              contentId: changeResponse.headers ? changeResponse.headers["Content-ID"] : void 0,
              data: changeResponse.data,
              error: changeResponse.message
            });
          }
        }
        return res;
      };

      ODataProvider.prototype.save = function(srcName, item, callback) {
        var request,
          _this = this;
        request = {
          requestUri: "" + (ODataProvider.serviceHost()) + "$batch",
          method: "POST",
          data: ODataProvider._getSaveRequestData(srcName, item)
        };
        return OData.request(request, function(data) {
          var expand, id, resp, rootResp;
          if (item.__action !== "delete") {
            resp = ODataProvider._parseSaveResponseData(data);
            expand = _this._getExpand(srcName, "$item");
            rootResp = resp.filter(function(x) {
              return x.contentId === "1";
            })[0];
            id = rootResp && rootResp.data ? rootResp.data.id : item.id;
            return _this.load(srcName, {
              id: {
                $eq: id
              },
              $expand: expand
            }, function(err, data) {
              if (!err) data = data[0];
              return callback(err, data);
            });
          } else {
            return callback(null, data);
          }
        }, function(err) {
          return callback(err);
        }, OData.batchHandler);
      };

      ODataProvider.prototype["delete"] = function(srcName, id, callback) {
        return this.save(srcName, {
          id: id,
          __state: {
            __status: "removed"
          }
        }, callback);
      };

      return ODataProvider;

    })();
    return {
      dataProvider: new ODataProvider()
    };
  });

}).call(this);
