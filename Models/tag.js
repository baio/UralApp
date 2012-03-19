(function() {

  define(function() {
    var Tag;
    Tag = (function() {

      function Tag() {
        this.id = ko.observable();
        this.name = ko.observable();
        this.shortName = ko.computed((function() {
          return this.name;
        }), this);
      }

      return Tag;

    })();
    return {
      ModelConstructor: Tag
    };
  });

}).call(this);
