(function() {

  define(function() {
    var ini;
    ini = function(opts) {
      return ko.bindingHandlers.autocomplete = {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
          var autocompleteOpts, bindingOpts, lastLabel;
          bindingOpts = allBindingsAccessor().autocompleteOpts;
          lastLabel = null;
          autocompleteOpts = {
            source: function(req, resp) {
              req.modelType = bindingOpts.modelType;
              return opts.source(req, resp);
            },
            select: function(event, ui) {
              lastLabel = ui.item.value;
              return valueAccessor()(opts._parse(ui.item));
            },
            change: function(event, ui) {
              if (lastLabel !== $(element).val()) {
                return valueAccessor()(opts._parse(opts._empty()));
              }
            }
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
