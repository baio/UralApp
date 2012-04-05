define ["Ural/Libs/amplify"], ->

  _subOnceList = []

  pub = (cat, name, data, callback) ->
    if callback then data.__pubCallback = callback
    amplify.publish "#{cat}.#{name}", data

  sub = (cat, name, callback) ->
    amplify.subscribe "#{cat}.#{name}", (data) ->
      pubCallback = data.__pubCallback
      data.__callback = undefined
      callback data, name, pubCallback

  subOnce = (cat, name, tag, callback) ->
    qualifyName = "#{cat}.#{name}.#{tag}"
    recentCallback = _subOnceList[qualifyName]
    if recentCallback
      amplify.unsubscribe "#{cat}.#{name}", recentCallback
    _subOnceList[qualifyName] = sub cat, name, callback


  pub : pub
  sub : sub
  subOnce : subOnce