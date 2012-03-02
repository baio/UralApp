toExist: (expected) ->
  expected != null and expected != undefined

beforeEach: ->
  @addMatchers
    toExist : toExist