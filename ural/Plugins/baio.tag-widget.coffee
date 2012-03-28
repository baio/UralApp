define ["Ural/Modules/ODataProvider", "Ural/Libs/tag-it"], (dataProvider) ->

  #tagit with autocomplete
  $.widget "baio.tag",

    options :
      url : null

    _create: ->
      $(@element[0]).tagit()
      $(@element[0]).tagit().keyup ->


