(function() {
  var libs;

  libs = ["order!Libs/jquery", "order!Libs/jquery.ui", "order!Libs/knockout", "order!Libs/knockout.mapping", "order!Libs/jsrender", "Libs/async", "utils", "Libs/underscore.string"];

  require(libs, function() {
    require.config({
      baseUrl: "."
    });
    return require(["router", "setup"], function(router) {
      var rr;
      rr = new router.Router();
      return rr.startRouting();
      /*
            (action) ->
              $(".nav li.active").toggleClass "active"
              $(".nav li").has("a[href='#{action}']").toggleClass "active"
      */
    });
  });

}).call(this);
