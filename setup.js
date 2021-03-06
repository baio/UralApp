(function() {

  define(["Ural/Modules/DataFilterOpts", "Ural/Modules/DataProvider", "Ural/Plugins/tags-binding", "Ural/Plugins/autocomplete-binding", "Ural/Plugins/tooltip-binding", "Models/tag", "bootstrap/js/bootstrap.min.js"], function(frOpt, dataProvider, tagsBinding, autocompleteBinding, tooltipBinding, tagModel) {
    var autocompleteOpts, tagsBindingOpts;
    frOpt.expandOpts.add(null, "$index", "");
    frOpt.expandOpts.add(null, "$item", "");
    frOpt.expandOpts.add("Product", "$index", "Tags,Producer");
    frOpt.expandOpts.add("Product", "$item", "Tags,Producer");
    frOpt.expandOpts.add("Producer", "$index", "Products");
    frOpt.expandOpts.add("Producer", "$item", "Products/Tags");
    frOpt.orderBy.def("id");
    frOpt.filterOpts.nullRefVal(-100500);
    window.__g = {
      nullRefVal: function() {
        return frOpt.filterOpts.nullRefVal();
      }
    };
    tagsBindingOpts = {
      tagSource: function(req, resp) {
        return dataProvider.get().load("Tag", {
          name: {
            $like: req.term
          }
        }, function(err, data) {
          if (!err) {
            return resp(data.map(function(d) {
              return {
                key: d.id,
                label: d.name,
                value: d.name
              };
            }));
          }
        });
      },
      _parse: function(item) {
        return ko.mapping.fromJS({
          id: item.key,
          name: item.value
        }, tagModel.mappingRules, new tagModel.ModelConstructor());
      },
      _format: function(item) {
        return {
          key: item.id(),
          label: item.name(),
          value: item.name()
        };
      }
    };
    tagsBinding.ini(tagsBindingOpts);
    autocompleteOpts = {
      source: function(req, resp) {
        return dataProvider.get().load(req.modelType, {
          name: {
            $like: req.term
          }
        }, function(err, data) {
          if (!err) {
            return resp(data.map(function(d) {
              return {
                key: d.id,
                label: d.name,
                value: d.name
              };
            }));
          }
        });
      },
      _parse: function(item) {
        return ko.mapping.fromJS({
          id: item.key,
          name: item.value
        }, tagModel.mappingRules, new tagModel.ModelConstructor());
      },
      _format: function(item) {
        return {
          key: item.id(),
          label: item.name(),
          value: item.name()
        };
      },
      _empty: function() {
        return {
          key: frOpt.filterOpts.nullRefVal()
        };
      }
    };
    autocompleteBinding.ini(autocompleteOpts);
    return tooltipBinding.ini();
  });

}).call(this);
