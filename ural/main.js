(function() {

  require(["Libs/jquery"], function() {
    return require(["../router"], function(router) {
      var rr;
      rr = new router.Router();
      return rr.startRouting(function(action) {
        $(".nav li.active").toggleClass("active");
        return $(".nav li").has("a[href='" + action + "']").toggleClass("active");
      });
    });
  });

}).call(this);
