define ["Ural/Modules/ODataFilter", "Ural/Modules/DataFilterOpts", "Libs/datajs"], (fr, frOpts) ->

  class ODataProvider
    @serviceHost: -> 'http://localhost:3360/Service.svc/'

    @_parse: (item)->
      if item == null or item == undefined or typeof item != "object" then return item
      if item.results and Array.isArray item.results
        arr = item.results
      if item.d && Array.isArray item.d
        arr = item.d
      if Array.isArray item
        arr = item
      if (arr) then return arr.map (i) -> ODataProvider._parse i
      obj = {}
      for own prop of item
        if prop == "__deferred" then return []
        if prop != "__metadata"
          obj[prop] = ODataProvider._parse item[prop]
      obj

    load: (srcName, filter, callback) ->
      stt = @_getStatement srcName, filter
      OData.read stt, (data) -> callback null, ODataProvider._parse(data)

    _getStatement: (srcName, filter) ->
      @_getSatementByODataFilter srcName, fr.convert filter

    _getExpand: (srcName, expand) ->
      res = frOpts.expandOpts.get srcName, expand
      if res == "" then null
      res ?= expand

    _getSatementByODataFilter: (srcName, oDataFilter) ->
      expand = @_getExpand srcName, oDataFilter.$expand
      _u.urlAddSearch "#{ODataProvider.serviceHost()}#{srcName}s",
        if oDataFilter.$filter then "$filter=#{oDataFilter.$filter}",
        if oDataFilter.$top then "$top=#{oDataFilter.$top}",
        if oDataFilter.$skip then "$skip=#{oDataFilter.$skip}",
        if expand then "$expand=#{expand}"

    save: (srcName, item, callback) ->
      OData.request
        headers : {"Content-Type" : "application/json"}
        requestUri: "#{ODataProvider.serviceHost()}#{srcName}s#{if item.id != -1 then "(#{item.id})" else ""}",
        method: if item.id == -1 then "POST" else "PUT",
        data: item
        ,(data, response) =>
          if data
            callback null, ODataProvider._parse(data)
          else
            @load srcName, id : {$eq : item.id}, (err, data) ->
              if !err then item = data[0]
              callback err, item

    delete: (srcName, id, callback) ->
      OData.request
        headers : {"Content-Type" : "application/json"}
        requestUri: "#{ODataProvider.serviceHost()}#{srcName}s(#{id})",
        method: "DELETE"
        ,(data, response) =>

  dataProvider : new ODataProvider()

