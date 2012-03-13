class Utils

  getClassName: (obj) ->
    if typeof obj != "object" or obj == null then return false
    /(\w+)\(/.exec(obj.constructor.toString())[1]

  getKey: (hashtable, index) ->
    cnt = 0
    for own key of hashtable
      if cnt == index then return key
      cnt++
    null

  firstKey: (hashtable) ->
    @getKey hashtable, 0

  first: (hashtable) ->
    hashtable[@firstKey(hashtable)]

  toHashTable: (array) ->
    hashtable = []
    for i in array
      hashtable[i[@getKey i, 0]] = i[@getKey i, 1]
    hashtable

  urlAddSearch: (baseUrl, prms) ->
    url = arguments[0]
    if !url then throw "baseUrl must be defined"
    for i in [1..arguments.length - 1]
      if arguments[i]
        if url.indexOf("?") == -1 then url += "?" else url += "&"
        url += arguments[i]
    url

@_u = new Utils()
