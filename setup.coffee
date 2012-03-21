define ["Ural/Modules/DataFilterOpts"], (frOpt) ->

  frOpt.expandOpts.add null, "$index", ""
  frOpt.expandOpts.add null, "$item", ""
  frOpt.expandOpts.add "Product", "$index", "Tags"
  frOpt.expandOpts.add "Product", "$item", "Tags"
  frOpt.expandOpts.add "Producer", "$index", "Products"
  frOpt.expandOpts.add "Producer", "$item", "Products/Tags"
