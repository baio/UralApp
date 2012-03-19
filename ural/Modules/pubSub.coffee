define ["Ural/Libs/amplify"], ->

  pub = (cat, name, data, callback) ->
    if callback then data.__pubCallback = callback
    amplify.publish "#{cat}.#{name}", data

  sub = (cat, name, callback) ->
    amplify.subscribe "#{cat}.#{name}", (data) ->
      pubCallback = data.__pubCallback
      data.__callback = undefined
      callback data, name, pubCallback

  pub : pub
  sub : sub