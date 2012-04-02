define ["Ural/Modules/DataFilterOpts"
  , "Ural/Modules/ODataProvider"
  , "Ural/Plugins/tags-binding"
  , "Ural/Plugins/autocomplete-binding"
  , "Models/Tag"
  ]
  , (frOpt, odataProvider, tagsBinding, autocompleteBinding, tagModel) ->

    frOpt.expandOpts.add null, "$index", ""
    frOpt.expandOpts.add null, "$item", ""
    frOpt.expandOpts.add "Product", "$index", "Tags,Producer"
    frOpt.expandOpts.add "Product", "$item", "Tags,Producer"
    frOpt.expandOpts.add "Producer", "$index", "Products"
    frOpt.expandOpts.add "Producer", "$item", "Products/Tags"
    frOpt.orderBy.def "id"
    frOpt.filterOpts.nullRefVal -100500

    #widgets
    #tags
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

    #autocomplete
    autocompleteOpts =
      source: (req, resp) ->
        odataProvider.dataProvider.load req.modelType, name : {$like : req.term}, (err, data) ->
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
      _empty : ->
        key : frOpt.filterOpts.nullRefVal()

    autocompleteBinding.ini autocompleteOpts

