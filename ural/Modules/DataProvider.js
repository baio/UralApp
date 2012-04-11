(function() {

  define(["Ural/Modules/ODataProvider", "Ural/Modules/WebSqlProvider"], function(odataProvider, webSqlProvider) {
    var get, set, _currentProviderName, _defaultDataProviderName;
    _defaultDataProviderName = "odata";
    _currentProviderName = _defaultDataProviderName;
    set = function(name) {
      return _currentProviderName = name ? name : _defaultDataProviderName;
    };
    get = function(name) {
      if (name == null) name = _currentProviderName;
      switch (name) {
        case "odata":
          return odataProvider.dataProvider;
        case "websql":
          return webSqlProvider.dataProvider;
      }
    };
    return {
      get: get,
      set: set
    };
  });

}).call(this);
