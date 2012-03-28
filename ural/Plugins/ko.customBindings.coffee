define ["Ural/Plugins/baio.tag-widget"], ->

  ko.bindingHandlers.tags =

    init: (element, valueAccessor, allBindingsAccessor, viewModel) ->
      $(element).tagit()

    update: (element, valueAccessor, allBindingsAccessor, viewModel) ->

