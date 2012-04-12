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
        if prop == "__deferred"
          return if _.str.endsWith prop, "s" then [] else id : __g.nullRefVal()
        if prop != "__metadata"
          obj[prop] = ODataProvider._parse item[prop]
      obj

    @_isDelete: (item) -> item and item.__state and item.__state.__status == "removed"

    @_formatRequest: (name, item, metadata, parentName, parentId, parentContentId, totalCount) ->
      res = []
      expnads = []
      totalCount ?= 1
      cid = totalCount
      isDelete = ODataProvider._isDelete item

      if !isDelete
        flattered = {}
        for own prop of item
          val = item[prop]
          if val != null and typeof val != "object" and !Array.isArray val
            flattered[prop] = val

      typeName = name.replace /^(.*)s$/, "$1"
      isArrayProp = typeName != name

      if !parentName
        #root item
        if isDelete
          data = method: "DELETE", uri: "#{name}s(#{item.id})"
        else
          data = switch item.id
            when -1 then method: "POST", uri: "#{name}s"
            else method: "PUT", uri: "#{name}s(#{item.id})"
      else
        parentName = parentName.replace /^(.*)s$/, "$1"
        #nested item
        if isDelete
          ref = if !isArrayProp then name else "#{typeName}s(#{item.id})"
          data = method: "DELETE", uri: "#{parentName}s(#{parentId})/$links/#{ref}"
        else
          ref = if parentId == -1 then "$#{parentContentId}" else "#{parentName}s(#{parentId})"
          if item.id != -1
            ###here actual update of referenced item###
            res.push
              headers: {"Content-ID": cid}
              requestUri: "#{typeName}s(#{item.id})"
              method: "PUT"
              data: flattered
            cid++
            ###here update link to referenced item###
            data = method: (if isArrayProp then "POST" else "PUT"), uri: "#{ref}/$links/#{name}"
            flattered = uri : "#{typeName}s(#{item.id})"
          else
            data = method: "POST", uri: "#{ref}/#{name}"

      res.push
        headers: {"Content-ID": cid}
        requestUri: data.uri
        method: data.method
        data: flattered

      totalCount += res.length

      if !isDelete
        for own prop of item
          if prop == "__state" then continue
          val = item[prop]
          if Array.isArray val
            states = item.__state[prop]
            val = val.concat states.filter((v) -> v.__status == "removed") if states
            for i, ix in val
              i.__state = states[ix] if states
              nested = ODataProvider._formatRequest prop, i, metadata, name, item.id, cid, totalCount
              totalCount += nested.length
              res = res.concat nested
          else if val != null and typeof val == "object"
            if val.id != __g.nullRefVal()
              val.__state = item.__state[prop]
              nested = ODataProvider._formatRequest prop, val, metadata, name, item.id, cid, totalCount
              totalCount += nested.length
              res = res.concat nested

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
      #metadata = ODataProvider._getMetadata srcName, item
      req = ODataProvider._formatRequest srcName, item #, metadata
      req.sort (a, b) -> a.headers["Content-ID"] - b.headers["Content-ID"]
      __batchRequests: [
        __changeRequests: req
      ]

    @_parseSaveResponseData: (data) ->
      res = []
      for batchResponse in data.__batchResponses
        for changeResponse in batchResponse.__changeResponses
          res.push
            type: null
            contentId: changeResponse.headers["Content-ID"] if changeResponse.headers
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
          if item.__action != "delete"
            resp = ODataProvider._parseSaveResponseData data
            expand = @_getExpand srcName, "$item"
            rootResp = resp.filter((x) -> x.contentId == "1")[0]
            id = if rootResp and rootResp.data then rootResp.data.id else item.id
            @load srcName, id: {$eq: id}, $expand: expand, (err, data) ->
              if !err then data = data[0]
              callback err, data
          else
            callback null, data
        , (err) ->
          callback err
        , OData.batchHandler

    delete: (srcName, id, callback) ->
      @save srcName, {id : id, __state : {__status : "removed"} } , callback

  dataProvider: new ODataProvider()

