(function() {

  define(["Ural/Modules/DataFilterOpts", "Ural/Plugins/ko.customBindings"], function(frOpt) {
    frOpt.expandOpts.add(null, "$index", "");
    frOpt.expandOpts.add(null, "$item", "");
    frOpt.expandOpts.add("Product", "$index", "Tags");
    frOpt.expandOpts.add("Product", "$item", "Tags");
    frOpt.expandOpts.add("Producer", "$index", "Products");
    return frOpt.expandOpts.add("Producer", "$item", "Products/Tags");
  });

}).call(this);
