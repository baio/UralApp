describe "framework 2 specific filter convertions", ->

  describe "convert framework filter to OData filter expression", ->

    filter = null

    beforeEach ->
      runs ->
        require ["Ural/Modules/ODataFilter"], (fr) -> filter = fr
      waits 500

    it "very simple filter: id = 1", ->
      runs ->
        expect(filter).toBeTruthy()
        frameworkFilter =
          id : {$eq : "1"}
        actual = filter.convert frameworkFilter
        expected =
          $filter : "id eq 1"
        expect(actual.$filter).toBe expected.$filter
        expect(actual.$skip).toBe expected.$skip
        expect(actual.$top).toBe expected.$top

    it "filter: id in (...) and name like (...)", ->
      runs ->
        frameworkFilter =
          $page : 1
          $itemsPerPage : 10
          id : {$in : [0,1,5]}
          name : {$like : "o"}
        actual = filter.convert frameworkFilter
        expected =
          $filter : "(id eq 0 or id eq 1 or id eq 5) and indexOf(name, 'o') != -1"
          $skip : 10
          $top : 10
        expect(actual.$filter).toBe expected.$filter
        expect(actual.$skip).toBe expected.$skip
        expect(actual.$top).toBe expected.$top


  describe "convert framework filter to WebSql filter expression", ->

    filter = null

    beforeEach ->
      runs ->
        require ["Ural/Modules/WebSqlFilter"], (fr) -> filter = fr
      waits 500

    it "very simple filter: id = 1", ->
      runs ->
        expect(filter).toBeTruthy()
        frameworkFilter =
          id : {$eq : "1"}
        actual = filter.convert frameworkFilter
        expected =
          $filter : "id = 1"
        expect(actual.$filter).toBe expected.$filter
        expect(actual.$skip).toBe expected.$skip
        expect(actual.$top).toBe expected.$top

    it "filter: id in (...) and name like (...)", ->
      runs ->
        frameworkFilter =
          $page : 1
          $itemsPerPage : 10
          id : {$in : [0,1,5]}
          name : {$like : "o"}
        actual = filter.convert frameworkFilter
        expected =
          $filter : "id IN (0,1,5) AND name LIKE 'o'"
          $skip : 10
          $top : 10
        expect(actual.$filter).toBe expected.$filter
        expect(actual.$skip).toBe expected.$skip
        expect(actual.$top).toBe expected.$top
