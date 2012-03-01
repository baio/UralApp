class Utils

  getClassName: (obj) ->
    if typeof obj != "object" or obj == null then return false
    /(\w+)\(/.exec(obj.constructor.toString())[1]

@_u = new Utils()
