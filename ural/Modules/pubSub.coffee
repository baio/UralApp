define ["Ural/Libs/amplify"], ->

  pub = (cat, name, data) ->
    amplify.publish "#{cat}.#{name}", data

  sub = (cat, name, callback) ->
    amplify.subscribe "#{cat}.#{name}", callback

  pub : pub
  sub : sub