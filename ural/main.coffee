libs = [
  "Libs/jquery", "Libs/async", "utils"
]
require libs, ->
  require.config
    baseUrl: "."
  require ["router", "setup"], (router) ->
      rr = new router.Router()
      rr.startRouting (action) ->
        $(".nav li.active").toggleClass "active"
        $(".nav li").has("a[href='#{action}']").toggleClass "active"