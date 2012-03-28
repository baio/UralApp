define ["Ural/Libs/tag-it"], ->

  #tagit with autocomplete
  $.widget "baio.tag",

    options:
      tagSource : null
      onTagAdded : null
      onTagRemoved : null

    _create: ->
      @tags = []

      opts =
        tagSource : @options.tagSource
        onTagAdded : (e, tag) =>
          t = @__tagToBeAdded
          if !t
            tagLabel = $(e.target).tagit "tagLabel", tag
            t = key : -1, value : tagLabel, label : tagLabel
          @tags.push t
          if @options.onTagAdded
            @options.onTagAdded t, if @__tagToBeAdded then false else true
        onTagRemoved : (e, tag) =>
          tagLabel = $(e.target).tagit "tagLabel", tag
          t = @tags.filter((i) -> i.value == tagLabel)[0]
          @tags.splice @tags.indexOf(t), 1
          if @options.onTagRemoved
            @options.onTagRemoved t, true

      $(@element[0]).tagit opts

    add: (tags) ->
      for tag in tags
        @__tagToBeAdded = tag
        $(@element[0]).tagit "createTag", tag.value
        @__tagToBeAdded = null

    assignedTags: ->
      $(@element[0]).tagit "assignedTags"



