define  ->

  ini = ->

    ko.bindingHandlers.tooltip =

      init: (element, valueAccessor, allBindingsAccessor, viewModel) ->
        val = ko.utils.unwrapObservable valueAccessor()
        $(element).tooltip title : val

  ini : ini