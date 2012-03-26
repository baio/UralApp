define ["Ural/Modules/ODataFilter", "Ural/Modules/DataFilterOpts", "Ural/Libs/datajs"], (fr, frOpts) ->
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

    @x_formatRequest: (name, item, parentName, parentContentId, totalCount)->
      res = []
      flattered = {}
      totalCount ?= 1
      cid = totalCount

      for own prop of item
        val = item[prop]

        if Array.isArray val
          typeName = prop.replace /^(.*)s$/, "$1"
          for i in val
            nested = ODataProvider._formatRequest typeName, i, name, cid, totalCount + 1
            totalCount += nested.length
            res = res.concat nested
          val = null
        else if typeof val == "object"
          contentID++
          res = res.concat ODataProvider._formatRequest prop, val, name, cid, contentID, ++totalCount
          val = null

        if val != null then flattered[prop] = val

      data = switch item.id
        when -1 then method : "POST", uri : "#{name}s"
        when -2 then method : "DELETE", uri : "#{name}s(#{item.id})"
        else method : "PUT", uri : "#{name}s(#{item.id})"

      if parentName
        flattered[parentName] = __metadata : {uri: "$#{parentContentId}.id"}

      res.push
        headers: {"Content-ID": cid}
        requestUri: data.uri
        method: data.method
        data: flattered

      res


    @_formatRequest: ->
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

    @_getSaveRequestData: (srcName, item) ->
      __batchRequests: [
        __changeRequests: ODataProvider._formatRequest srcName, item
      ]

    @_parseSaveResponseData: (data) ->
      res = []
      for batchResponse in data.__batchResponses
        for changeResponse in batchResponse.__changeResponses
          res.push
            type : null
            data : changeResponse.data
            error : changeResponse.message
      res[0]

    save: (srcName, item, callback) ->
      request =
        requestUri: "#{ODataProvider.serviceHost()}$batch"
        method: "POST"
        data: ODataProvider._getSaveRequestData srcName, item

      OData.request request
        , (data) =>
          resp = ODataProvider._parseSaveResponseData data
          if resp
            callback resp.errors, ODataProvider._parse(resp.data)
          else
            @load srcName, id : {$eq : item.id}, (err, data) ->
              if !err then item = data[0]
              callback err, item
        , (err) ->
          callback err
        , OData.batchHandler

    delete: (srcName, id, callback) ->
      OData.request
        headers: {"Content-Type": "application/json"}
        requestUri: "#{ODataProvider.serviceHost()}#{srcName}s(#{id})",
        method: "DELETE",(data, response) =>

  dataProvider: new ODataProvider()

