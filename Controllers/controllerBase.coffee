define ["Ural/Controllers/controllerBase"
  , "Models/Zones/itemToolbox"
  , "Models/Zones/indexToolbox"
],
(controllerBase, itemToolbox, indexToolbox) ->
  class ControllerBase extends controllerBase.ControllerBase

    constructor: (modelName, opts)->
      super modelName, opts
      @defaultIndexLayout = "Shared/__LayoutIndex"
      @defaultItemLayout = "Shared/__LayoutItem"

    onCreateIndexViewModel: (model, modelModule) ->
      vm = super model, modelModule
      vm.zones =
        toolbox : indexToolbox.indexToolbox
      vm

    onCreateItemViewModel: (model, modelModule) ->
      vm = super model, modelModule
      vm.zones =
        toolbox : itemToolbox.itemToolbox
      vm

    onShowForm: ($form) ->
      $form.modal 'show'

    onHideForm: ($form) ->
      $form.modal 'hide'

  ControllerBase : ControllerBase