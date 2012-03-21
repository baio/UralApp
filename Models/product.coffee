define ["Models/tag"], (tag) ->

  class Product
    constructor: ->
      @id = ko.observable()
      @name = ko.observable()
      @comp = ko.computed (-> @id() + " " + @name()), @
      @Tags = ko.observableArray()

  mappingRules = ->
    name :
      update: (opts) -> opts.data + "foo"
    Tags :
      create: (opts) -> ko.mapping.fromJS opts.data, tag.mappingRules, new tag.ModelConstructor()

  ModelConstructor : Product
  mappingRules : mappingRules()
