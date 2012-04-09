define ["Controllers/controllerBase"],
(controllerBase) ->

  class ProducerController extends controllerBase.ControllerBase
    constructor: (opts) ->
      super "Producer", opts

  ProducerController : ProducerController