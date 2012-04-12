(function() {

  define(function() {
    var ini;
    ini = function() {
      return ko.bindingHandlers.tooltip = {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
          var val;
          val = ko.utils.unwrapObservable(valueAccessor());
          return $(element).tooltip({
            title: val
          });
        }
      };
    };
    return {
      ini: ini
    };
  });

}).call(this);
