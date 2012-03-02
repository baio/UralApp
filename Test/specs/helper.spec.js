(function() {

  ({
    toExist: function(expected) {
      return expected !== null && expected !== void 0;
    },
    beforeEach: function() {
      return this.addMatchers({
        toExist: toExist
      });
    }
  });

}).call(this);
