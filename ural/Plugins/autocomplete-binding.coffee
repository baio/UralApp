define ->

  ini = (opts) ->

    ko.bindingHandlers.autocomplete =

      init: (element, valueAccessor, allBindingsAccessor, viewModel) ->
        bindingOpts = allBindingsAccessor().autocompleteOpts
        lastLabel = null
        autocompleteOpts =
          source: (req, resp) ->
            req.modelType = bindingOpts.modelType
            opts.source req, resp
          select: (event, ui) ->
            lastLabel = ui.item.value
            valueAccessor() opts._parse ui.item
          change: (event, ui) ->
            #TODO: check on existense and AllowNotInList (propbably service oper CheckName(ModelType, Name))
            #valueAccessor() opts._parse key : -1, value : $(element).val()
            #if not exists mark with error
            #if _u.trim($(element).val()) == ""
            #if item not selected from list, remove one
            if lastLabel != $(element).val()
              valueAccessor() opts._parse opts._empty()

        $(element).autocomplete autocompleteOpts

      update: (element, valueAccessor, allBindingsAccessor, viewModel) ->
        value = ko.utils.unwrapObservable valueAccessor()
        value = opts._format value
        if $(element).val() != value.value
          $(element).val value.value

  ini : ini