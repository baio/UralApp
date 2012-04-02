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

    @_isDelete: (item) -> (item.__action  and item.__action == "delete") or frOpts.filterOpts.isNullRef item

    @_formatRequest: (name, item, metadata, parentName, parentId, parentContentId, totalCount) ->
      #only root item could be deleted
      #nested items, marked for delete (id!=-2) - just remove realtion
      #nested item - either new link (id!=-1) or new item + new link (id==-1)
      res = []
      expnads = []

      totalCount ?= 1
      cid = totalCount
      isDelete = ODataProvider._isDelete item

      if !isDelete

        flattered = {}

        for own prop of item
          val = item[prop]
          typeName = prop.replace /^(.*)s$/, "$1"

          if Array.isArray val
            for i in val
              nested = ODataProvider._formatRequest typeName, i, metadata, name, item.id, cid, totalCount + 1
              totalCount += nested.length
              res = res.concat nested
            val = null
          else if typeof val == "object"
            nested = ODataProvider._formatRequest typeName, val, metadata, name, item.id, cid, totalCount + 1
            totalCount += nested.length
            res = res.concat nested
            val = null

          if val != null then flattered[prop] = val

      if !parentName
        #root item
        if isDelete
          data = method: "DELETE", uri: "#{name}s(#{item.id})"
        else
          data = switch item.id
            when -1 then method: "POST", uri: "#{name}s"
            else method: "PUT", uri: "#{name}s(#{item.id})"
      else
        #nested item
        if isDelete
          ref = if frOpts.filterOpts.isNullRef item then name else "#{name}s(#{item.id})"
          data = method: "DELETE", uri: "#{parentName}s(#{parentId})/$links/#{ref}"
        else
          #data = method: "POST", uri: if parentId == -1 then "$#{parentContentId}/#{name}s" else "#{parentName}s(#{parentId})/#{name}s"
          #data = method: "PUT", uri: if parentId == -1 then "$#{parentContentId}/#{name}" else "#{parentName}s(#{parentId})/#{name}"
          ref = if parentId == -1 then "$#{parentContentId}" else "#{parentName}s(#{parentId})"
          if item.id != -1
            data = method: "PUT", uri: "#{ref}/$links/#{name}"
            flattered = uri : "#{name}s(#{item.id})"
          else
            data = method: "POST", uri: "$#{ref}/#{name}"

      res.push
        headers: {"Content-ID": cid}
        requestUri: data.uri
        method: data.method
        data: flattered

      res

    ###
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
    ###
    @_getExpandsFromItem: (name, item) ->
      res = []
      nested = []
      for own prop of item
        val = item[prop]
        if Array.isArray val
          if val.length > 0
            nested = ODataProvider._getExpandsFromItem prop, val[0]
        else if typeof val == "object"
          nested = ODataProvider._getExpandsFromItem prop, val
      if nested.length
        for n in nested
          name = name + "/" if name
          res.push name + n
      else if name
        res.push name
      res

    load: (srcName, filter, callback) ->
      stt = @_getStatement srcName, filter
      OData.read stt, (data) -> callback null, ODataProvider._parse(data)

    _getStatement: (srcName, filter) ->
      @_getSatementByODataFilter srcName, fr.convert filter

    _getExpand: (srcName, expand) ->
      res = frOpts.expandOpts.get srcName, expand
      if res == "" then null
      res ?= expand

    _getOrderBy: (filter, orderby) ->
      singleItemFilter = filter.match /^.*id eq .*$/
      if singleItemFilter then return null
      orderby ?= frOpts.orderBy.def()

    _getSatementByODataFilter: (srcName, oDataFilter) ->
      expand = @_getExpand srcName, oDataFilter.$expand
      orderby = @_getOrderBy oDataFilter.$filter, oDataFilter.$orderby
      _u.urlAddSearch "#{ODataProvider.serviceHost()}#{srcName}s",
        if oDataFilter.$filter then "$filter=#{oDataFilter.$filter}",
        if oDataFilter.$top then "$top=#{oDataFilter.$top}",
        if oDataFilter.$skip then "$skip=#{oDataFilter.$skip}",
        if expand then "$expand=#{expand}",
        if orderby then "$orderby=#{orderby}"

    @_getMetadata: (srcName, item) ->
      null

    @_getSaveRequestData: (srcName, item) ->
      metadata = ODataProvider._getMetadata srcName, item
      __batchRequests: [
        __changeRequests: ODataProvider._formatRequest srcName, item, metadata
      ]

    @_parseSaveResponseData: (data) ->
      res = []
      for batchResponse in data.__batchResponses
        for changeResponse in batchResponse.__changeResponses
          res.push
            type: null
            contentId: changeResponse.headers["Content-ID"]
            data: changeResponse.data
            error: changeResponse.message
      res

    save: (srcName, item, callback) ->
      request =
        requestUri: "#{ODataProvider.serviceHost()}$batch"
        method: "POST"
        data: ODataProvider._getSaveRequestData srcName, item

      OData.request request
        , (data) =>
          resp = ODataProvider._parseSaveResponseData data
          expand = ODataProvider._getExpandsFromItem(name, item).toString()
          rootResp = resp.filter((x) -> x.contentId == "1")[0]
          id = if rootResp and rootResp.data then rootResp.data.id else item.id
          @load srcName, id: {$eq: id}, $expand: expand, (err, data) ->
            if !err then data = data[0]
            callback err, data
        , (err) ->
          callback err
        , OData.batchHandler

    delete: (srcName, id, callback) ->
      OData.request
        headers: {"Content-Type": "application/json"}
        requestUri: "#{ODataProvider.serviceHost()}#{srcName}s(#{id})",
        method: "DELETE",(data, response) =>

  dataProvider: new ODataProvider()

