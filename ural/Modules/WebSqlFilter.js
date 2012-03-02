(function() {
  var __hasProp = Object.prototype.hasOwnProperty;

  define(function() {
    var convert, _convertField, _convertToken;
    _convertToken = function(fieldName, tokenName, val) {
      switch (tokenName) {
        case "$eq":
          return "" + fieldName + " = " + val;
        case "$like":
          return "" + fieldName + " LIKE '" + val + "'";
        case "$in":
          return "" + fieldName + " IN (" + (val.toString()) + ")";
        default:
          throw "can't convert token expression { " + fieldName + " : { " + tokenName + " : " + field + " }}";
      }
    };
    _convertField = function(fieldName, field) {
      var tokenName;
      return ((function() {
        var _results;
        _results = [];
        for (tokenName in field) {
          if (!__hasProp.call(field, tokenName)) continue;
          _results.push(_convertToken(fieldName, tokenName, field[tokenName]));
        }
        return _results;
      })()).join(" AND ");
    };
    /*
      Convert frameworkFilter to filter which is complied to format of odata query expressions (odata.org)
      Options
        - **$page** {Int, default:undefined}, page number to return
        - **$itemsPerPage** {Int, default:10}, number of items conteined in one page
        - **any field name**, field name with filter condition, see mongodb conventions
        @param {Object} [options] structure to convert
        @return converted structure {$skip, $top, $filter}
        @api public
    */
    convert = function(frameworkFilter) {
      var field, fieldFilters, itemsPerPage, page, res;
      fieldFilters = [];
      for (field in frameworkFilter) {
        if (!__hasProp.call(frameworkFilter, field)) continue;
        if (field === "$page") {
          page = frameworkFilter[field];
        } else if (field === "$itemsPerPage") {
          itemsPerPage = frameworkFilter[field];
        } else {
          fieldFilters.push(_convertField(field, frameworkFilter[field]));
        }
      }
      res = {
        $filter: fieldFilters.join(" AND ")
      };
      if (page) {
        if (itemsPerPage == null) itemsPerPage = 10;
        res.$top = itemsPerPage;
        res.$skip = page * itemsPerPage;
      }
      return res;
    };
    return {
      convert: convert
    };
  });

}).call(this);
