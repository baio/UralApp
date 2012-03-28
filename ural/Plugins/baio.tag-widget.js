(function() {

  define(["Ural/Modules/ODataProvider", "Ural/Libs/tag-it"], function(dataProvider) {
    return $.widget("baio.tag", {
      options: {
        url: null
      },
      _create: function() {
        $(this.element[0]).tagit();
        return $(this.element[0]).tagit().keyup(function() {});
      }
    });
  });

}).call(this);
