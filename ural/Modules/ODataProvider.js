(function() {
  var __hasProp = Object.prototype.hasOwnProperty;

  define(["Ural/Modules/ODataFilter", "Libs/datajs"], function(fr) {
    var ODataProvider;
    OData.defaultHttpClient.enableJsonpCallback = true;
    ODataProvider = (function() {

      function ODataProvider() {}

      ODataProvider.serviceHost = function() {
        return 'http://localhost:3360/Service.svc/';
      };

      ODataProvider._parse = function(item) {
        var arr, obj, prop;
        if (item === null || typeof item !== "object") return item;
        if (item.results && Array.isArray(item.results)) arr = item.results;
        if (item.d && Array.isArray(item.d)) arr = item.d;
        if (arr) {
          return arr.map(function(i) {
            return ODataProvider._parse(i);
          });
        }
        obj = {};
        for (prop in item) {
          if (!__hasProp.call(item, prop)) continue;
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

      ODataProvider.prototype._getSatementByODataFilter = function(srcName, oDataFilter) {
        return _u.urlAddSearch("" + (ODataProvider.serviceHost()) + srcName + "s", oDataFilter.$filter ? "$filter=" + oDataFilter.$filter : void 0, oDataFilter.$top ? "$top=" + oDataFilter.$top : void 0, oDataFilter.$skip ? "$skip=" + oDataFilter.$skip : void 0);
      };

      return ODataProvider;

    })();
    return {
      dataProvider: new ODataProvider()
    };
  });

}).call(this);
