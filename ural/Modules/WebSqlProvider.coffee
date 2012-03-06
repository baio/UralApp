define ["Ural/Modules/WebSqlFilter"], (fr) ->

  class WebSqlProvider

    load: (srcName, filter, callback) ->
       
    _getStatement: (srcName, filter) ->
        @_getSatementByWebSqlFilter srcName, fr.convert filter

    _getSatementByWebSqlFilter: (srcName, webSqlFilter) ->
        res = "SELECT * FROM #{srcName}"
        if webSqlFilter
            if (webSqlFilter.$filter) then res += " WHERE #{webSqlFilter.$filter}"
            if (webSqlFilter.$top) then res += " LIMIT #{webSqlFilter.$top}"
            if (webSqlFilter.$skip) then res += " OFFSET #{webSqlFilter.$skip}"
        res

  dataProvider : new WebSqlProvider()