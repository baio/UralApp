(function() {

  define(["Ural/Modules/DataFilterOpts", "Ural/Modules/ODataProvider", "Ural/Plugins/tags-binding", "Models/Tag"], function(frOpt, odataProvider, tagsBinding, tagModel) {
    var tagsBindingOpts;
    frOpt.expandOpts.add(null, "$index", "");
    frOpt.expandOpts.add(null, "$item", "");
    frOpt.expandOpts.add("Product", "$index", "Tags");
    frOpt.expandOpts.add("Product", "$item", "Tags");
    frOpt.expandOpts.add("Producer", "$index", "Products");
    frOpt.expandOpts.add("Producer", "$item", "Products/Tags");
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
    return tagsBinding.ini(tagsBindingOpts);
  });

}).call(this);
