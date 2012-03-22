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

      ODataProvider._formatRequest = function(name, item, parentName, parentContentId, totalCount) {
        var cid, data, flattered, i, prop, res, typeName, val, _i, _len;
        res = [];
        flattered = {};
        if (totalCount == null) totalCount = 1;
        cid = totalCount;
        for (prop in item) {
          if (!__hasProp.call(item, prop)) continue;
          val = item[prop];
          if (Array.isArray(val)) {
            typeName = prop.replace(/^(.*)s$/, "$1");
            for (_i = 0, _len = val.length; _i < _len; _i++) {
              i = val[_i];
              res = res.concat(ODataProvider._formatRequest(typeName, i, name, cid, ++totalCount));
            }
            val = null;
          } else if (typeof val === "object") {
            contentID++;
            res = res.concat(ODataProvider._formatRequest(prop, val, name, cid, contentID, ++totalCount));
            val = null;
          }
          if (val !== null) flattered[prop] = val;
        }
        data = (function() {
          switch (item.id) {
            case -1:
              return {
                method: "POST",
                uri: "" + name + "s"
              };
            case -2:
              return {
                method: "DELETE",
                uri: "" + name + "s(" + item.id + ")"
              };
            default:
              return {
                method: "PUT",
                uri: "" + name + "s(" + item.id + ")"
              };
          }
        })();
        if (parentName) {
          flattered[parentName] = {
            __metadata: {
              uri: "$" + parentContentId
            }
          };
        }
        res.push({
          headers: {
            "Content-ID": cid
          },
          requestUri: data.uri,
          method: data.method,
          data: flattered
        });
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

      ODataProvider.prototype._getSatementByODataFilter = function(srcName, oDataFilter) {
        var expand;
        expand = this._getExpand(srcName, oDataFilter.$expand);
        return _u.urlAddSearch("" + (ODataProvider.serviceHost()) + srcName + "s", oDataFilter.$filter ? "$filter=" + oDataFilter.$filter : void 0, oDataFilter.$top ? "$top=" + oDataFilter.$top : void 0, oDataFilter.$skip ? "$skip=" + oDataFilter.$skip : void 0, expand ? "$expand=" + expand : void 0);
      };

      ODataProvider._getSaveRequestData = function(srcName, item) {
        return {
          __batchRequests: [
            {
              __changeRequests: ODataProvider._formatRequest(srcName, item)
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
          var resp;
          resp = ODataProvider._parseSaveResponseData(data);
          if (resp.data) {
            return callback(resp.errors, ODataProvider._parse(resp.data));
          } else {
            return _this.load(srcName, {
              id: {
                $eq: item.id
              }
            }, function(err, data) {
              if (!err) item = data[0];
              return callback(err, item);
            });
          }
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
