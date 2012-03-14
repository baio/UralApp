define ->

  class Product
    constructor: ->
      @id = ko.observable()
      @name = ko.observable()
      @comp = ko.computed (-> @id() + " " + @name()), @

  mappingRules = ->
    name :
      update: (opts) -> opts.data + "foo"

  ModelConstructor : Product
  mappingRules : mappingRules()
