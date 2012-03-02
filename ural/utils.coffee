class Utils

  getClassName: (obj) ->
    if typeof obj != "object" or obj == null then return false
    /(\w+)\(/.exec(obj.constructor.toString())[1]

  toHashTable: (array) ->
    for i in array
      hashtable[getKey i, 0] = hashtable[getKey i, 1]
    hashtable

  getKey: (hashtable, index) ->
    cnt = 0
    for own key of hashtable
      if cnt == index then return key
      cnt++
    null

  firstKey: (hashtable) ->
    getKey hashtable, 0

  first: (hashtable) ->
    hashtable[firstKey(hashtable)]

@_u = new Utils()
