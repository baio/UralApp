define ["Ural/Modules/ODataProvider"], (ODataProvider) ->

  dataProvider = ODataProvider.dataProvider

  describe "OData provider statements", ->
    it "plain without any filter", ->

      actual = dataProvider._getStatement "Product", null
      expect(actual).toBe "http://localhost:3360/Service.svc/Products"

    it "id = 0", ->

      expect(dataProvider).toBeTruthy()
      actual = dataProvider._getStatement "Product", id : {$eq : 0 }
      expect(actual).toBe "http://localhost:3360/Service.svc/Products?$filter=id eq 0"

    it "id in (...)", ->

      expect(dataProvider).toBeTruthy()
      actual = dataProvider._getStatement "Product", id : {$in : [0,1,3] }
      expect(actual).toBe "http://localhost:3360/Service.svc/Products?$filter=(id eq 0 or id eq 1 or id eq 3)"

    it "id = 0 and name LIKE(...) OFFSET LIMIT", ->

      expect(dataProvider).toBeTruthy()
      actual = dataProvider._getStatement "Product", id : { $eq : 0}, name : {$like : 'r'}, $page : 5, $itemsPerPage : 7
      expect(actual).toBe "http://localhost:3360/Service.svc/Products?$filter=id eq 0 and indexof(name, 'r') ne -1&$top=7&$skip=35"

    it "name = 'zero'", ->

      expect(dataProvider).toBeTruthy()
      actual = dataProvider._getStatement "Product", name : {$eq : 'zero'}
      expect(actual).toBe "http://localhost:3360/Service.svc/Products?$filter=name eq 'zero'"


  describe "load data via OData provider", ->
    data = null
    it "empty filter", ->
      runs ->
        dataProvider.load "Product", null, (err, d) -> data = d
      waits 500
      runs ->
        expect(data.length).toBe 6
        expect(data[0].id).toBe 0
        expect(data[0].name).toBe "zero"
        expect(data[1].id).toBe 1
        expect(data[1].name).toBe "one"
        expect(data[4].id).toBe 4
        expect(data[4].name).toBe "four"
    it "id = 0", ->
      runs ->
        dataProvider.load "Product", id : {$eq : 0}, (err, d) -> data = d
      waits 500
      runs ->
        expect(data.length).toBe 1
        expect(data[0].id).toBe 0
        expect(data[0].name).toBe "zero"
    it "id in (...)", ->
      runs ->
        dataProvider.load "Product", id : {$in : [0,1,3] }, (err, d) -> data = d
      waits 500
      runs ->
        expect(data.length).toBe 3
        expect(data[0].id).toBe 0
        expect(data[0].name).toBe "zero"
        expect(data[1].id).toBe 1
        expect(data[1].name).toBe "one"
        expect(data[2].id).toBe 3
        expect(data[2].name).toBe "three"
    it "id = 0 and name LIKE(...) skip top", ->
      runs ->
        dataProvider.load "Product", id : { $eq : 0}, name : {$like : 'r'}, (err, d) -> data = d
      waits 500
      runs ->
        expect(data.length).toBe 1
        expect(data[0].id).toBe 0
        expect(data[0].name).toBe "zero"

  describe "save data via OData provider", ->
    it "update first item name to -zero-", ->
      data = null
      err = null
      runs ->
        dataProvider.save "Product", {id : 0, name : "-zero-"}, (e, d) -> data = d; err = e
      waits 500
      runs ->
        expect(err).toBeFalsy()
        expect(data.name).toBe "-zero-"
        data = null
        dataProvider.load "Product", id : { $eq : 0}, (e, d) -> data = d; err = e
      waits 500
      runs ->
        expect(err).toBeFalsy()
        expect(data[0].name).toBe "-zero-"
    it "update first item name to zero", ->
      data = null
      err = null
      runs ->
        dataProvider.save "Product", {id : 0, name : "zero"}, (e, d) -> data = d; err = e
      waits 500
      runs ->
        expect(err).toBeFalsy()
        expect(data.name).toBe "zero"
        data = null
        dataProvider.load "Product", id : { $eq : 0}, (e, d) -> data = d; err = e
      waits 500
      runs ->
        expect(err).toBeFalsy()
        expect(data[0].name).toBe "zero"

  describe "create data via OData provider", ->
    it "create six", ->
      data = null
      err = null
      runs ->
        dataProvider.save "Product", {id : -1, name : "six"}, (e, d) -> data = d; err = e
      waits 500
      runs ->
        expect(err).toBeFalsy()
        expect(data.id == -1).toBeFalsy()
        expect(data.name).toBe "six"
        id = data.id
        data = null
        dataProvider.load "Product", id : { $eq : id}, (e, d) -> data = d; err = e
      waits 500
      runs ->
        expect(err).toBeFalsy()
        expect(data[0].name).toBe "six"

  describe "delete data via OData provider", ->
    it "delete six", ->
      data = null
      err = null
      runs ->
        dataProvider.load "Product", {name : {$eq : "six"}}, (e, d) -> data = d; err = e
      waits 500
      runs ->
        expect(err).toBeFalsy()
        expect(data.length > 0).toBeTruthy()
        for id in data.map((d) -> d.id)
          dataProvider.delete "Product", id, (e) -> err = e
      waits 500
      runs ->
        expect(err).toBeFalsy()
        dataProvider.load "Product", {name : {$eq : "six"}}, (e, d) ->
          expect(err).toBeFalsy()
          expect(d.length == 0).toBeTruthy()

