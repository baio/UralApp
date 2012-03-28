(function() {

  define(["Ural/Plugins/baio.tag-widget"], function() {
    var ini;
    ini = function(opts) {
      var _format;
      _format = function(valueAccessor) {
        var values;
        values = ko.utils.unwrapObservable(valueAccessor());
        return values.map(function(v) {
          return opts._format(v);
        });
      };
      return ko.bindingHandlers.tags = {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
          opts.onTagAdded = function(tag, userInput) {
            if (userInput) return valueAccessor().push(opts._parse(tag));
          };
          opts.onTagRemoved = function(tag, userInput) {
            var index, t, _len, _ref;
            if (userInput) {
              _ref = _format(valueAccessor);
              for (index = 0, _len = _ref.length; index < _len; index++) {
                t = _ref[index];
                if (t.value === tag.value) break;
              }
              t = ko.utils.unwrapObservable(valueAccessor())[index];
              return valueAccessor().remove(t);
            }
          };
          return $(element).tag(opts);
        },
        update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
          var names, newTags, vals;
          names = $(element).tag("assignedTags");
          vals = _format(valueAccessor);
          newTags = vals.filter(function(v) {
            return names.indexOf(v.value) === -1;
          });
          return $(element).tag("add", newTags);
        }
      };
    };
    return {
      ini: ini
    };
  });

}).call(this);
