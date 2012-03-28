(function() {

  define(["Ural/Libs/tag-it"], function() {
    return $.widget("baio.tag", {
      options: {
        tagSource: null,
        onTagAdded: null,
        onTagRemoved: null
      },
      _create: function() {
        var opts,
          _this = this;
        this.tags = [];
        opts = {
          tagSource: this.options.tagSource,
          onTagAdded: function(e, tag) {
            var t, tagLabel;
            t = _this.__tagToBeAdded;
            if (!t) {
              tagLabel = $(e.target).tagit("tagLabel", tag);
              t = {
                key: -1,
                value: tagLabel,
                label: tagLabel
              };
            }
            _this.tags.push(t);
            if (_this.options.onTagAdded) {
              return _this.options.onTagAdded(t, _this.__tagToBeAdded ? false : true);
            }
          },
          onTagRemoved: function(e, tag) {
            var t, tagLabel;
            tagLabel = $(e.target).tagit("tagLabel", tag);
            t = _this.tags.filter(function(i) {
              return i.value === tagLabel;
            })[0];
            _this.tags.splice(_this.tags.indexOf(t), 1);
            if (_this.options.onTagRemoved) {
              return _this.options.onTagRemoved(t, true);
            }
          }
        };
        return $(this.element[0]).tagit(opts);
      },
      add: function(tags) {
        var tag, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = tags.length; _i < _len; _i++) {
          tag = tags[_i];
          this.__tagToBeAdded = tag;
          $(this.element[0]).tagit("createTag", tag.value);
          _results.push(this.__tagToBeAdded = null);
        }
        return _results;
      },
      assignedTags: function() {
        return $(this.element[0]).tagit("assignedTags");
      }
    });
  });

}).call(this);
