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

@_u = new Utils()
