define ["Ural/Modules/ODataProvider", "Ural/Modules/WebSqlProvider"], (odataProvider, webSqlProvider) ->

  _defaultDataProviderName = "odata"
  _currentProviderName = _defaultDataProviderName

  set = (name) ->
    _currentProviderName = if name then  name else _defaultDataProviderName

  get = (name) ->
    name ?= _currentProviderName
    switch name
      when "odata" then odataProvider.dataProvider
      when "websql" then webSqlProvider.dataProvider


  get : get
  set : set