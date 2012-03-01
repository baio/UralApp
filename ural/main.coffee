libs = [
  "Libs/jquery", "utils", "async"
]
require libs, ->
  require.config
    baseUrl: "."
  require ["router"], (router) ->
      rr = new router.Router()
      rr.startRouting (action) ->
        $(".nav li.active").toggleClass "active"
        $(".nav li").has("a[href='#{action}']").toggleClass "active"