(function() {

  define(["Ural/Modules/DataFilterOpts", "Ural/Modules/ODataProvider", "Ural/Plugins/tags-binding", "Ural/Plugins/autocomplete-binding", "Models/Tag"], function(frOpt, odataProvider, tagsBinding, autocompleteBinding, tagModel) {
    var autocompleteOpts, tagsBindingOpts, __g;
    __g = {
      REF_NULL_ID: -100500
    };
    frOpt.expandOpts.add(null, "$index", "");
    frOpt.expandOpts.add(null, "$item", "");
    frOpt.expandOpts.add("Product", "$index", "Tags,Producer");
    frOpt.expandOpts.add("Product", "$item", "Tags,Producer");
    frOpt.expandOpts.add("Producer", "$index", "Products");
    frOpt.expandOpts.add("Producer", "$item", "Products/Tags");
    frOpt.orderBy.def("id");
    tagsBindingOpts = {
      tagSource: function(req, resp) {
        return odataProvider.dataProvider.load("Tag", {
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
        return odataProvider.dataProvider.load(req.modelType, {
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
          key: __g.REF_NULL_ID
        };
      }
    };
    return autocompleteBinding.ini(autocompleteOpts);
  });

}).call(this);
