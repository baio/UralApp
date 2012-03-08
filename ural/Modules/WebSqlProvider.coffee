define ["Ural/Modules/WebSqlFilter"], (fr) ->

  class WebSqlProvider

    load: (srcName, filter, callback) ->
        stt = @_getStatement srcName, filter
        db = openDatabase 'test', '1.0', 'spec database', 2 * 1024 * 1024
        db.transaction (tx) ->
            res = []
            tx.executeSql stt, [], (tx, results) ->
                for i in [0..results.rows.length - 1]
                    res.push results.rows.item i
                callback res

       
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