define ["Ural/Modules/ODataFilter", "Libs/datajs"], (fr) ->

  OData.defaultHttpClient.enableJsonpCallback = true

  class ODataProvider
    @serviceHost: -> 'http://localhost:3360/Service.svc/'

    @_parse: (item)->
      if item == null or typeof item != "object" then return item
      if item.results and Array.isArray item.results
        arr = item.results
      if item.d && Array.isArray item.d
        arr = item.d
      if (arr) then return arr.map (i) -> ODataProvider._parse i
      obj = {}
      for own prop of item
        if prop != "__metadata"
          obj[prop] = ODataProvider._parse item[prop]
      obj

    load: (srcName, filter, callback) ->
      stt = @_getStatement srcName, filter
      OData.read stt, (data) -> callback null, ODataProvider._parse(data)

    _getStatement: (srcName, filter) ->
      @_getSatementByODataFilter srcName, fr.convert filter

    _getSatementByODataFilter: (srcName, oDataFilter) ->
      _u.urlAddSearch "#{ODataProvider.serviceHost()}#{srcName}s",
        if oDataFilter.$filter then "$filter=#{oDataFilter.$filter}",
        if oDataFilter.$top then "$top=#{oDataFilter.$top}",
        if oDataFilter.$skip then "$skip=#{oDataFilter.$skip}"

    save: (srcName, item, callback) ->
      OData.request
        requestUri: "#{ODataProvider.serviceHost()}#{srcName}s",
        method: if item.id == -1 then "PUT" else "POST",
        data: item
        ,(data, response) ->
          callback null, data

  dataProvider : new ODataProvider()

