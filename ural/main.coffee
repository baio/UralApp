libs = [
  "order!Libs/jquery", "order!Libs/jquery.ui", "order!Libs/knockout", "order!Libs/knockout.mapping", "order!Libs/jsrender"
  , "Libs/async", "utils", "Libs/underscore.string"
]
require libs, ->
  require.config
    baseUrl: "."
  require ["router", "setup"], (router) ->
      rr = new router.Router()
      rr.startRouting()
      ###
      (action) ->
        $(".nav li.active").toggleClass "active"
        $(".nav li").has("a[href='#{action}']").toggleClass "active"
      ###