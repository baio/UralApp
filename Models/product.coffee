define ["Models/tag"], (tag) ->

  class Product
    constructor: ->
      @id = ko.observable()
      @name = ko.observable()
      @Tags = ko.observableArray()
      @Producer = ko.observable()
      @comp = ko.computed (-> @id() + " " + @name() + "foo"), @

      ko.mapping.fromJS __metadata.def, __metadata.mapping, @

  __metadata =
    def:
      id : -1
      name : null
      Tags : []
      Producer : {id : __g.nullRefVal(), name : null}
    mapping:
        name :
          update: (opts) -> opts.data
        Tags :
          update: (opts) -> ko.mapping.fromJS opts.data, tag.mappingRules, new tag.ModelConstructor()
        Producer :
          update: (opts) -> ko.mapping.fromJS opts.data, tag.mappingRules, new tag.ModelConstructor()

  ModelConstructor : Product
  metadata : __metadata

