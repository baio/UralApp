define ["Models/tag"], (tag) ->

  class Product
    constructor: ->
      @id = ko.observable()
      @name = ko.observable()
      @comp = ko.computed (-> @id() + " " + @name() + "foo"), @
      @Tags = ko.observableArray()
      @Producer = ko.observable()

  mappingRules = ->
    name :
      update: (opts) -> opts.data
    Tags :
      update: (opts) -> ko.mapping.fromJS opts.data, tag.mappingRules, new tag.ModelConstructor()
    Producer :
      update: (opts) -> ko.mapping.fromJS opts.data, tag.mappingRules, new tag.ModelConstructor()

  ModelConstructor : Product
  mappingRules : mappingRules()
