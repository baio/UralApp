define ["Ural/Plugins/baio.tag-widget"], ->

  ini = (opts) ->

    _format = (valueAccessor) ->
      values = ko.utils.unwrapObservable valueAccessor()
      values.map (v) -> opts._format(v)

    ko.bindingHandlers.tags =

      init: (element, valueAccessor, allBindingsAccessor, viewModel) ->
        opts.onTagAdded = (tag, userInput) ->
          if userInput
            valueAccessor().push opts._parse tag
        opts.onTagRemoved = (tag, userInput) ->
          if userInput
            for t, index in _format(valueAccessor)
              if t.value == tag.value then break
            t = ko.utils.unwrapObservable(valueAccessor())[index]
            valueAccessor().remove t
        $(element).tag opts

      update: (element, valueAccessor, allBindingsAccessor, viewModel) ->
        names = $(element).tag "assignedTags"
        vals = _format valueAccessor
        newTags = vals.filter((v) ->  names.indexOf(v.value) == -1)
        $(element).tag "add", newTags

  ini : ini