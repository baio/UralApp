(function() {

  require.config({
    baseUrl: '../'
  });

  define(["Models/producer"], function(producerModule) {
    return describe("item refs wrapped indexVM", function() {
      return it("map to producer raw data, check Products has indexVM type", function() {
        var data, producer;
        data = {
          id: 10,
          name: "ten",
          Products: [
            {
              id: 1,
              name: "one",
              Producer: {
                id: -100500,
                name: null
              },
              Tags: []
            }
          ]
        };
        producer = new producerModule.ModelConstructor();
        ko.mapping.fromJS(data, producerModule.mappingRules, producer);
        return expect(_u.getClassName(producer.Products)).toBe("IndexVM");
      });
    });
  });

}).call(this);
