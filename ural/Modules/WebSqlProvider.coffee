define ["Ural/Modules/WebSqlFilter"], (filter) ->

  class WebSqlProvider
    load: (srcName, filter, callback) ->
        f = filter.convert filter

    _getSatement: (srcName, webSqlFilter) ->
        res = "SELECT * FROM #{srcName}"
        if webSqlFilter
            if (webSqlFilter.$filter) then res += " WHERE #{webSqlFilter.$filter}"
            if (webSqlFilter.$skip) then res += " LIMIT #{webSqlFilter.$top}"
            if (webSqlFilter.$filter) then res += " OFFSET #{webSqlFilter.$skip}"
        res

  dataProvider : new WebSqlProvider()