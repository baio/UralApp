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
          if (prop === "__deferred") return [];
          if (prop !== "__metadata") obj[prop] = ODataProvider._parse(item[prop]);
        }
        return obj;
      };

      ODataProvider._isDelete = function(item) {
        return (item.__action && item.__action === "delete") || frOpts.filterOpts.isNullRef(item);
      };

      ODataProvider._formatRequest = function(name, item, metadata, parentName, parentId, parentContentId, totalCount) {
        var cid, data, expnads, flattered, i, isArrayProp, isDelete, links, nested, prop, ref, res, typeName, val, _i, _len;
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
            if (Array.isArray(val)) {
              for (_i = 0, _len = val.length; _i < _len; _i++) {
                i = val[_i];
                nested = ODataProvider._formatRequest(prop, i, metadata, name, item.id, cid, totalCount + 1);
                totalCount += nested.length;
                res = res.concat(nested);
              }
              val = null;
            } else if (typeof val === "object") {
              nested = ODataProvider._formatRequest(prop, val, metadata, name, item.id, cid, totalCount + 1);
              totalCount += nested.length;
              res = res.concat(nested);
              val = null;
            }
            if (val !== null) flattered[prop] = val;
          }
        }
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
          typeName = name.replace(/^(.*)s$/, "$1");
          if (isDelete) {
            ref = frOpts.filterOpts.isNullRef(item) ? name : "" + typeName + "s(" + item.id + ")";
            data = {
              method: "DELETE",
              uri: "" + parentName + "s(" + parentId + ")/$links/" + ref
            };
          } else {
            ref = parentId === -1 ? "$" + parentContentId : "" + parentName + "s(" + parentId + ")";
            if (item.id !== -1) {
              isArrayProp = typeName !== name;
              data = {
                method: (isArrayProp ? "POST" : "PUT"),
                uri: "" + ref + "/$links/" + name
              };
              flattered = {
                uri: "" + typeName + "s(" + item.id + ")"
              };
            } else {
              links = item.id !== -1 ? "$links/" : "";
              data = {
                method: "POST",
                uri: "" + ref + "/" + links + name
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
        return res.reverse();
      };

      /*
          @x_formatRequest: ->
            #product exists, tags exist
            [
              {
                requestUri: "Products(0)/Tags"
                method: "POST"
                data : { id : 1, name : "Sport" }
              }
            ]
            #product not extists, tags exist
            [
              {
              headers: {"Content-ID": 1}
              requestUri: "Products"
              method: "POST"
              data : { id : -1, name : "chicken" }
              },
              {
              requestUri: "$1/Tags"
              method: "POST"
              data : { id : 1, name : "Sport" }
              }
            ]
            #product extists, tags not exist
            [
              {
              requestUri: "Products(0)/Tags"
              method: "POST"
              data : { id : -1, name : "chicken-tag" }
              }
            ]
            #product not extists, tags not exist
            [
              {
              headers: {"Content-ID": 1}
              requestUri: "Products"
              method: "POST"
              data : { id : -1, name : "chicken" }
              },
              {
              requestUri: "$1/Tags"
              method: "POST"
              data : { id : -1, name : "chicken-tag" }
              }
            ]
            #delete link
            [
              {
              requestUri: "/Products(91)/$links/Tags(17)"
              method: "DELETE"
              }
            ]
      */

      ODataProvider._getExpandsFromItem = function(name, item) {
        var n, nested, prop, res, val, _i, _len;
        res = [];
        nested = [];
        for (prop in item) {
          if (!__hasProp.call(item, prop)) continue;
          val = item[prop];
          if (Array.isArray(val)) {
            if (val.length > 0) {
              nested = ODataProvider._getExpandsFromItem(prop, val[0]);
            }
          } else if (typeof val === "object") {
            nested = ODataProvider._getExpandsFromItem(prop, val);
          }
        }
        if (nested.length) {
          for (_i = 0, _len = nested.length; _i < _len; _i++) {
            n = nested[_i];
            if (name) name = name + "/";
            res.push(name + n);
          }
        } else if (name) {
          res.push(name);
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
        var metadata;
        metadata = ODataProvider._getMetadata(srcName, item);
        return {
          __batchRequests: [
            {
              __changeRequests: ODataProvider._formatRequest(srcName, item, metadata)
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
              contentId: changeResponse.headers["Content-ID"],
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
          resp = ODataProvider._parseSaveResponseData(data);
          expand = ODataProvider._getExpandsFromItem(name, item).toString();
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
        }, function(err) {
          return callback(err);
        }, OData.batchHandler);
      };

      ODataProvider.prototype["delete"] = function(srcName, id, callback) {
        var _this = this;
        return OData.request({
          headers: {
            "Content-Type": "application/json"
          },
          requestUri: "" + (ODataProvider.serviceHost()) + srcName + "s(" + id + ")",
          method: "DELETE"
        }, function(data, response) {});
      };

      return ODataProvider;

    })();
    return {
      dataProvider: new ODataProvider()
    };
  });

}).call(this);
