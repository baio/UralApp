(function() {

  define(["Ural/Modules/ODataProvider", "setup"], function(ODataProvider) {
    var dataProvider;
    dataProvider = ODataProvider.dataProvider;
    describe("OData provider statements", function() {
      it("plain without any filter", function() {
        var actual;
        actual = dataProvider._getStatement("Product", null);
        return expect(actual).toBe("http://localhost:3360/Service.svc/Products?$orderby=id");
      });
      it("id = 0", function() {
        var actual;
        expect(dataProvider).toBeTruthy();
        actual = dataProvider._getStatement("Product", {
          id: {
            $eq: 0
          },
          $expand: "$item"
        });
        return expect(actual).toBe("http://localhost:3360/Service.svc/Products?$filter=id eq 0&$expand=Tags,Producer");
      });
      it("id in (...)", function() {
        var actual;
        expect(dataProvider).toBeTruthy();
        actual = dataProvider._getStatement("Product", {
          id: {
            $in: [0, 1, 3]
          }
        });
        return expect(actual).toBe("http://localhost:3360/Service.svc/Products?$filter=(id eq 0 or id eq 1 or id eq 3)");
      });
      it("id = 0 and name LIKE(...) OFFSET LIMIT", function() {
        var actual;
        expect(dataProvider).toBeTruthy();
        actual = dataProvider._getStatement("Product", {
          id: {
            $eq: 0
          },
          name: {
            $LIKE: 'r'
          },
          $page: 5,
          $itemsPerPage: 7
        });
        return expect(actual).toBe("http://localhost:3360/Service.svc/Products?$filter=id eq 0 and indexof(name, 'r') ne -1&$top=7&$skip=35");
      });
      it("name = 'zero'", function() {
        var actual;
        expect(dataProvider).toBeTruthy();
        actual = dataProvider._getStatement("Product", {
          name: {
            $eq: 'zero'
          }
        });
        return expect(actual).toBe("http://localhost:3360/Service.svc/Products?$filter=name eq 'zero'&$orderby=id");
      });
      it("Producer id = '0' expand = Products", function() {
        var actual;
        expect(dataProvider).toBeTruthy();
        actual = dataProvider._getStatement("Producer", {
          id: {
            $eq: 0
          },
          $expand: "Products"
        });
        return expect(actual).toBe("http://localhost:3360/Service.svc/Producers?$filter=id eq 0&$expand=Products");
      });
      it("Producers expand = Products/Tags", function() {
        var actual;
        expect(dataProvider).toBeTruthy();
        actual = dataProvider._getStatement("Producer", {
          $expand: "Products/Tags"
        });
        return expect(actual).toBe("http://localhost:3360/Service.svc/Producers?$expand=Products/Tags&$orderby=id");
      });
      it("Producers expand = $index", function() {
        var actual;
        expect(dataProvider).toBeTruthy();
        actual = dataProvider._getStatement("Producer", {
          $expand: "$index"
        });
        return expect(actual).toBe("http://localhost:3360/Service.svc/Producers?$expand=Products&$orderby=id");
      });
      return it("Producers expand = $item", function() {
        var actual;
        expect(dataProvider).toBeTruthy();
        actual = dataProvider._getStatement("Producer", {
          $expand: "$item"
        });
        return expect(actual).toBe("http://localhost:3360/Service.svc/Producers?$expand=Products/Tags&$orderby=id");
      });
    });
    describe("load data via OData provider", function() {
      var data;
      data = null;
      it("empty filter", function() {
        runs(function() {
          return dataProvider.load("Product", null, function(err, d) {
            return data = d;
          });
        });
        waits(500);
        return runs(function() {
          expect(data.length).toBe(6);
          expect(data[0].id).toBe(0);
          expect(data[0].name).toBe("zero");
          expect(data[1].id).toBe(1);
          expect(data[1].name).toBe("one");
          expect(data[4].id).toBe(4);
          return expect(data[4].name).toBe("four");
        });
      });
      it("id = 0", function() {
        runs(function() {
          return dataProvider.load("Product", {
            id: {
              $eq: 0
            }
          }, function(err, d) {
            return data = d;
          });
        });
        waits(500);
        return runs(function() {
          expect(data.length).toBe(1);
          expect(data[0].id).toBe(0);
          return expect(data[0].name).toBe("zero");
        });
      });
      it("id in (...)", function() {
        runs(function() {
          return dataProvider.load("Product", {
            id: {
              $in: [0, 1, 3]
            }
          }, function(err, d) {
            return data = d;
          });
        });
        waits(500);
        return runs(function() {
          expect(data.length).toBe(3);
          expect(data[0].id).toBe(0);
          expect(data[0].name).toBe("zero");
          expect(data[1].id).toBe(1);
          expect(data[1].name).toBe("one");
          expect(data[2].id).toBe(3);
          return expect(data[2].name).toBe("three");
        });
      });
      it("id = 0 and name LIKE(...) skip top", function() {
        runs(function() {
          return dataProvider.load("Product", {
            id: {
              $eq: 0
            },
            name: {
              $like: 'r'
            }
          }, function(err, d) {
            return data = d;
          });
        });
        waits(500);
        return runs(function() {
          expect(data.length).toBe(1);
          expect(data[0].id).toBe(0);
          return expect(data[0].name).toBe("zero");
        });
      });
      it("Producer id = 0 for index", function() {
        runs(function() {
          return dataProvider.load("Producer", {
            id: {
              $eq: 1
            },
            $expand: "$index"
          }, function(err, d) {
            return data = d;
          });
        });
        waits(500);
        return runs(function() {
          expect(data.length).toBe(1);
          expect(data[0].id).toBe(1);
          expect(data[0].name).toBe("IBM");
          expect(data[0].Products.length).toBe(2);
          expect(data[0].Products[0].id).toBe(0);
          return expect(data[0].Products[0].Tags.length).toBe(0);
        });
      });
      return it("Producers for item", function() {
        runs(function() {
          return dataProvider.load("Producer", {
            $expand: "$item"
          }, function(err, d) {
            return data = d;
          });
        });
        waits(500);
        return runs(function() {
          expect(data.length).toBe(2);
          expect(data[0].id).toBe(1);
          expect(data[0].name).toBe("IBM");
          expect(data[0].Products.length).toBe(2);
          expect(data[0].Products[0].id).toBe(0);
          expect(data[0].Products[0].Tags.length).toBe(2);
          expect(data[0].Products[0].Tags[1].id).toBe(2);
          return expect(data[0].Products[0].Tags[1].name).toBe("Hobby");
        });
      });
    });
    describe("save data via OData provider", function() {
      it("update first item name to -zero-", function() {
        var data, err;
        data = null;
        err = null;
        runs(function() {
          return dataProvider.save("Product", {
            id: 0,
            name: "-zero-"
          }, function(e, d) {
            data = d;
            return err = e;
          });
        });
        waits(500);
        runs(function() {
          expect(err).toBeFalsy();
          expect(data.name).toBe("-zero-");
          data = null;
          return dataProvider.load("Product", {
            id: {
              $eq: 0
            },
            $expand: "$item"
          }, function(e, d) {
            data = d[0];
            return err = e;
          });
        });
        waits(500);
        return runs(function() {
          expect(err).toBeFalsy();
          expect(data.name).toBe("-zero-");
          expect(data.Producer).toBeTruthy();
          expect(data.Producer.id).toBe(1);
          return expect(data.Producer.name).toBe("IBM");
        });
      });
      it("update first item name to zero", function() {
        var data, err;
        data = null;
        err = null;
        runs(function() {
          return dataProvider.save("Product", {
            id: 0,
            name: "zero"
          }, function(e, d) {
            data = d;
            return err = e;
          });
        });
        waits(500);
        runs(function() {
          expect(err).toBeFalsy();
          expect(data.name).toBe("zero");
          data = null;
          return dataProvider.load("Product", {
            id: {
              $eq: 0
            }
          }, function(e, d) {
            data = d;
            return err = e;
          });
        });
        waits(500);
        return runs(function() {
          expect(err).toBeFalsy();
          return expect(data[0].name).toBe("zero");
        });
      });
      it("update data with relations (tags - many to many) create relation then delete", function() {
        var data, err;
        data = null;
        err = null;
        runs(function() {
          return dataProvider.save("Product", {
            id: 3,
            name: "three",
            Tags: [
              {
                id: 1,
                name: "Sport"
              }
            ]
          }, function(e, d) {
            data = d;
            return err = e;
          });
        });
        waits(500);
        runs(function() {
          expect(err).toBeFalsy();
          expect(data.name).toBe("three");
          expect(data.Tags.length).toBe(1);
          expect(data.Tags[0].id).toBe(1);
          expect(data.Tags[0].name).toBe("Sport");
          data = null;
          return dataProvider.load("Product", {
            id: {
              $eq: 3
            },
            $expand: "$item"
          }, function(e, d) {
            data = d[0];
            return err = e;
          });
        });
        waits(500);
        runs(function() {
          expect(err).toBeFalsy();
          expect(data.name).toBe("three");
          expect(data.Tags.length).toBe(1);
          expect(data.Tags[0].id).toBe(1);
          return expect(data.Tags[0].name).toBe("Sport");
        });
        runs(function() {
          return dataProvider.save("Product", {
            id: 3,
            name: "three",
            Tags: [
              {
                id: 1,
                name: "Sport",
                __action: "delete"
              }
            ]
          }, function(e, d) {
            data = d;
            return err = e;
          });
        });
        waits(500);
        return runs(function() {
          expect(err).toBeFalsy();
          expect(data.name).toBe("three");
          return expect(data.Tags.length).toBe(0);
        });
      });
      it("update data with relations (tags - many to many) create new Product then relation then delete", function() {
        var data, err;
        data = null;
        err = null;
        runs(function() {
          return dataProvider.save("Product", {
            id: -1,
            name: "seven",
            Tags: [
              {
                id: 1,
                name: "Sport"
              }, {
                id: 2,
                name: "Hobby"
              }
            ]
          }, function(e, d) {
            data = d;
            return err = e;
          });
        });
        waits(500);
        runs(function() {
          var id;
          expect(err).toBeFalsy();
          expect(data.name).toBe("seven");
          expect(data.Tags.length).toBe(2);
          expect(data.Tags[1].id).toBe(1);
          expect(data.Tags[1].name).toBe("Sport");
          id = data.id;
          data = null;
          return dataProvider.load("Product", {
            id: {
              $eq: id
            },
            $expand: "$item"
          }, function(e, d) {
            data = d[0];
            return err = e;
          });
        });
        waits(500);
        runs(function() {
          expect(err).toBeFalsy();
          expect(data.name).toBe("seven");
          expect(data.Tags.length).toBe(2);
          expect(data.Tags[1].id).toBe(1);
          return expect(data.Tags[1].name).toBe("Sport");
        });
        runs(function() {
          return dataProvider.save("Product", {
            id: data.id,
            __action: "delete"
          }, function(e, d) {
            data = d;
            return err = e;
          });
        });
        waits(500);
        return runs(function() {
          return expect(err).toBeFalsy();
        });
      });
      it("update data with relations (tags - many to many) create new Product then new Tag relation then delete", function() {
        var data, err;
        data = null;
        err = null;
        runs(function() {
          return dataProvider.save("Product", {
            id: -1,
            name: "seven",
            Tags: [
              {
                id: -1,
                name: "seven-tag-1"
              }, {
                id: -1,
                name: "seven-tag-2"
              }
            ]
          }, function(e, d) {
            data = d;
            return err = e;
          });
        });
        waits(500);
        runs(function() {
          var id;
          expect(err).toBeFalsy();
          expect(data.name).toBe("seven");
          expect(data.Tags.length).toBe(2);
          expect(data.Tags[1].id).not.toBe(-1);
          expect(data.Tags[1].name).toBe("seven-tag-1");
          id = data.id;
          data = null;
          return dataProvider.load("Product", {
            id: {
              $eq: id
            },
            $expand: "$item"
          }, function(e, d) {
            data = d[0];
            return err = e;
          });
        });
        waits(500);
        runs(function() {
          expect(err).toBeFalsy();
          expect(data.name).toBe("seven");
          expect(data.Tags.length).toBe(2);
          expect(data.Tags[1].id).not.toBe(-1);
          return expect(data.Tags[1].name).toBe("seven-tag-1");
        });
        return runs(function() {
          var _this = this;
          dataProvider.save("Product", {
            id: data.id,
            __action: "delete"
          }, function(e, d) {
            err = e;
            return expect(err).toBeFalsy();
          });
          dataProvider.save("Tag", {
            id: data.Tags[0].id,
            __action: "delete"
          }, function(e, d) {
            err = e;
            return expect(err).toBeFalsy();
          });
          return dataProvider.save("Tag", {
            id: data.Tags[1].id,
            __action: "delete"
          }, function(e, d) {
            err = e;
            return expect(err).toBeFalsy();
          });
        });
      });
      it("update data with relations (producer - one to many)", function() {
        var data, err;
        data = null;
        err = null;
        runs(function() {
          return dataProvider.save("Product", {
            id: 3,
            name: "three",
            Producer: {
              id: 1,
              name: "IBM"
            },
            Tags: []
          }, function(e, d) {
            data = d;
            return err = e;
          });
        });
        waits(500);
        runs(function() {
          expect(err).toBeFalsy();
          expect(data.name).toBe("three");
          expect(data.Producer.id).toBe(1);
          expect(data.Producer.name).toBe("IBM");
          data = null;
          return dataProvider.load("Product", {
            id: {
              $eq: 3
            },
            $expand: "$item"
          }, function(e, d) {
            data = d[0];
            return err = e;
          });
        });
        waits(500);
        runs(function() {
          expect(err).toBeFalsy();
          expect(data.name).toBe("three");
          expect(data.Producer.id).toBe(1);
          return expect(data.Producer.name).toBe("IBM");
        });
        runs(function() {
          return dataProvider.save("Product", {
            id: 3,
            name: "three",
            Producer: {
              id: -100500
            }
          }, function(e, d) {
            data = d;
            return err = e;
          });
        });
        waits(500);
        return runs(function() {
          expect(err).toBeFalsy();
          return expect(data.Producer.id).toBe(-100500);
        });
      });
      it("create product then add producer ref then delete", function() {
        var data, err;
        data = null;
        err = null;
        runs(function() {
          return dataProvider.save("Product", {
            id: -1,
            name: "seven",
            Producer: {
              id: 1,
              name: "IBM"
            }
          }, function(e, d) {
            data = d;
            return err = e;
          });
        });
        waits(500);
        runs(function() {
          var id;
          expect(err).toBeFalsy();
          expect(data.Producer.id).not.toBe(-1);
          expect(data.name).toBe("seven");
          expect(data.Producer.id).toBe(1);
          expect(data.Producer.name).toBe("IBM");
          id = data.id;
          data = null;
          return dataProvider.load("Product", {
            id: {
              $eq: id
            },
            $expand: "$item"
          }, function(e, d) {
            data = d[0];
            return err = e;
          });
        });
        waits(500);
        runs(function() {
          expect(err).toBeFalsy();
          expect(data.name).toBe("seven");
          expect(data.Producer.id).toBe(1);
          expect(data.Producer.name).toBe("IBM");
          return dataProvider.save("Product", {
            id: data.id,
            __action: "delete"
          }, function(e, d) {
            return err = e;
          });
        });
        return runs(function() {
          return expect(err).toBeFalsy();
        });
      });
      return xit("create product then create and add producer ref then delete", function() {
        var data, err;
        data = null;
        err = null;
        runs(function() {
          return dataProvider.save("Product", {
            id: -1,
            name: "seven",
            Producer: {
              id: -1,
              name: "seven-producer"
            }
          }, function(e, d) {
            data = d;
            return err = e;
          });
        });
        waits(500);
        runs(function() {
          var id;
          expect(err).toBeFalsy();
          expect(data.Producer.id).not.toBe(-1);
          expect(data.name).toBe("seven");
          expect(data.Producer.id).not.toBe(-1);
          expect(data.Producer.name).toBe("seven-producer");
          id = data.id;
          data = null;
          return dataProvider.load("Product", {
            id: {
              $eq: id
            },
            $expand: "$item"
          }, function(e, d) {
            data = d[0];
            return err = e;
          });
        });
        waits(500);
        return runs(function() {
          var _this = this;
          expect(err).toBeFalsy();
          expect(data.Producer.id).not.toBe(-1);
          expect(data.name).toBe("seven");
          expect(data.Producer.id).not.toBe(-1);
          expect(data.Producer.name).toBe("seven-producer");
          return dataProvider.save("Product", {
            id: data.id,
            __action: "delete"
          }, function(e, d) {
            err = e;
            return expect(err).toBeFalsy();
          });
        });
      });
    });
    describe("create data via OData provider", function() {
      return it("create six", function() {
        var data, err;
        data = null;
        err = null;
        runs(function() {
          return dataProvider.save("Product", {
            id: -1,
            name: "six"
          }, function(e, d) {
            data = d;
            return err = e;
          });
        });
        waits(500);
        runs(function() {
          var id;
          expect(err).toBeFalsy();
          expect(data.id === -1).toBeFalsy();
          expect(data.name).toBe("six");
          id = data.id;
          data = null;
          return dataProvider.load("Product", {
            id: {
              $eq: id
            }
          }, function(e, d) {
            data = d;
            return err = e;
          });
        });
        waits(500);
        return runs(function() {
          expect(err).toBeFalsy();
          return expect(data[0].name).toBe("six");
        });
      });
    });
    return describe("delete data via OData provider", function() {
      return it("delete six", function() {
        var data, err;
        data = null;
        err = null;
        runs(function() {
          return dataProvider.load("Product", {
            name: {
              $eq: "six"
            }
          }, function(e, d) {
            data = d;
            return err = e;
          });
        });
        waits(500);
        runs(function() {
          var id, _i, _len, _ref, _results;
          expect(err).toBeFalsy();
          expect(data.length > 0).toBeTruthy();
          _ref = data.map(function(d) {
            return d.id;
          });
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            id = _ref[_i];
            _results.push(dataProvider["delete"]("Product", id, function(e) {
              return err = e;
            }));
          }
          return _results;
        });
        waits(500);
        return runs(function() {
          expect(err).toBeFalsy();
          return dataProvider.load("Product", {
            name: {
              $eq: "six"
            }
          }, function(e, d) {
            expect(err).toBeFalsy();
            return expect(d.length === 0).toBeTruthy();
          });
        });
      });
    });
  });

}).call(this);
