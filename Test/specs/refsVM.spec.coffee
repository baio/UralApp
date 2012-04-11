require.config
  baseUrl: '../'

define ["Models/producer"], (producerModule) ->

  describe "item refs wrapped indexVM", ->

    it "map to producer raw data, check Products has indexVM type", ->
      data =
        id : 10
        name : "ten"
        Products : [ {id : 1, name : "one", Producer : {id : -100500, name : null}, Tags : []} ]

      producer = new producerModule.ModelConstructor()

      ko.mapping.fromJS data, producerModule.mappingRules, producer

      expect(_u.getClassName producer.Products).toBe "IndexVM"