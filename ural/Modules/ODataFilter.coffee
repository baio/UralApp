define  ->

  _convertToken = (fieldName, tokenName, val) ->
    switch tokenName
      when "$eq" then "#{fieldName} eq #{if typeof val == "string" then "'#{val}'" else val}"
      when "$LIKE" then "indexof(#{fieldName}, '#{val}') ne -1"
      when "$like" then "indexof(toupper(#{fieldName}), '#{val.toUpperCase()}') ne -1"
      when "$in" then "(#{(val.map (x) -> "#{fieldName} eq #{x}").join " or "})"
      else throw "can't convert token expression { #{fieldName} : { #{tokenName} : #{field} }}"

  _convertField = (fieldName, field) ->
    (_convertToken fieldName, tokenName, field[tokenName] for own tokenName of field).join " and "

  ###
  Convert frameworkFilter to filter which is complied to format of odata query expressions (odata.org)
  Options
    - **$page** {Int, default:undefined}, page number to return
    - **$itemsPerPage** {Int, default:10}, number of items conteined in one page
    - **any field name**, field name with filter condition, see mongodb conventions
    @param {Object} [options] structure to convert
    @return converted structure {$skip, $top, $filter}
    @api public
  ###
  convert = (frameworkFilter) ->
    fieldFilters = []
    for own field of frameworkFilter
      if field == "$page"
        page = frameworkFilter[field]
      else if  field == "$itemsPerPage"
        itemsPerPage = frameworkFilter[field]
      else if field == "$expand"
        expand = frameworkFilter[field]
      else
        fieldFilters.push _convertField(field, frameworkFilter[field])

    res =
      $filter : fieldFilters.join " and "

    if page
      itemsPerPage ?= 10
      res.$top = itemsPerPage
      res.$skip = page * itemsPerPage

    if expand
      res.$expand = expand

    res

  convert : convert