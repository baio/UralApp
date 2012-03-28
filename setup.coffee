define ["Ural/Modules/DataFilterOpts"
  , "Ural/Modules/ODataProvider"
  , "Ural/Plugins/tags-binding"
  , "Models/Tag"
  ]
  , (frOpt, odataProvider, tagsBinding, tagModel) ->

    frOpt.expandOpts.add null, "$index", ""
    frOpt.expandOpts.add null, "$item", ""
    frOpt.expandOpts.add "Product", "$index", "Tags"
    frOpt.expandOpts.add "Product", "$item", "Tags"
    frOpt.expandOpts.add "Producer", "$index", "Products"
    frOpt.expandOpts.add "Producer", "$item", "Products/Tags"

    #widgets
    tagsBindingOpts =
      tagSource: (req, resp) ->
        odataProvider.dataProvider.load "Tag", name : {$like : req.term}, (err, data) ->
          if !err
            resp data.map (d) ->
              key : d.id
              label : d.name
              value : d.name
      _parse : (item) ->
        ko.mapping.fromJS {id : item.key, name : item.value}, tagModel.mappingRules, new tagModel.ModelConstructor()
      _format : (item) ->
        key : item.id()
        label : item.name()
        value : item.name()

    tagsBinding.ini tagsBindingOpts
