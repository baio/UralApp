require ["Libs/jquery"], ->
  require ["../router"], (router) ->
    rr = new router.Router()
    rr.startRouting (action) ->
      $(".nav li.active").toggleClass "active"
      $(".nav li").has("a[href='#{action}']").toggleClass "active"