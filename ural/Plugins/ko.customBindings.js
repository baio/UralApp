(function() {

  define(["Ural/Plugins/baio.tag-widget"], function() {
    return ko.bindingHandlers.tags = {
      init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        return $(element).tagit();
      },
      update: function(element, valueAccessor, allBindingsAccessor, viewModel) {}
    };
  });

}).call(this);
