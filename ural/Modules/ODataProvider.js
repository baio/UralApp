(function() {
  var __hasProp = Object.prototype.hasOwnProperty;

  define(["Ural/Modules/ODataFilter", "Ural/Modules/DataFilterOpts", "Libs/datajs"], function(fr, frOpts) {
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
        return res != null ? res : res = expand;
      };

      ODataProvider.prototype._getSatementByODataFilter = function(srcName, oDataFilter) {
        return _u.urlAddSearch("" + (ODataProvider.serviceHost()) + srcName + "s", oDataFilter.$filter ? "$filter=" + oDataFilter.$filter : void 0, oDataFilter.$top ? "$top=" + oDataFilter.$top : void 0, oDataFilter.$skip ? "$skip=" + oDataFilter.$skip : void 0, oDataFilter.$expand ? "$expand=" + (this._getExpand(srcName, oDataFilter.$expand)) : void 0);
      };

      ODataProvider.prototype.save = function(srcName, item, callback) {
        var _this = this;
        return OData.request({
          headers: {
            "Content-Type": "application/json"
          },
          requestUri: "" + (ODataProvider.serviceHost()) + srcName + "s" + (item.id !== -1 ? "(" + item.id + ")" : ""),
          method: item.id === -1 ? "POST" : "PUT",
          data: item
        }, function(data, response) {
          if (data) {
            return callback(null, ODataProvider._parse(data));
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
        });
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
