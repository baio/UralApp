(function() {

  define(function() {
    var ini;
    ini = function(opts) {
      return ko.bindingHandlers.autocomplete = {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
          var autocompleteOpts;
          autocompleteOpts = {
            source: function(req, resp) {
              return opts.source(req, resp);
            },
            select: function(event, ui) {},
            change: function(event, ui) {}
          };
          return $(element).autocomplete(autocompleteOpts);
        },
        update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
          var value;
          value = ko.utils.unwrapObservable(valueAccessor());
          value = opts._format(value);
          if ($(element).val() !== value.value) return $(element).val(value.value);
        }
      };
    };
    return {
      ini: ini
    };
  });

}).call(this);
