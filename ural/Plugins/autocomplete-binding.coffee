define ->

  ini = (opts) ->

    ko.bindingHandlers.autocomplete =

      init: (element, valueAccessor, allBindingsAccessor, viewModel) ->
        autocompleteOpts =
          source: (req, resp) ->
            opts.source req, resp
          select: (event, ui) ->
          change: (event, ui) ->

        $(element).autocomplete autocompleteOpts

      update: (element, valueAccessor, allBindingsAccessor, viewModel) ->
        value = ko.utils.unwrapObservable valueAccessor()
        value = opts._format value
        if $(element).val() != value.value
          $(element).val value.value

  ini : ini