define ->

  class Tag
    constructor: ->
      @id = ko.observable()
      @name = ko.observable()
      @shortName = ko.computed (-> @name() + " short"), @

  ModelConstructor : Tag

