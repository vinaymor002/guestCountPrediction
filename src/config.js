export default {
  predictionService: {
    baseUrl: "http://localhost:4000",
    services: {
      predictionModel: "/prediction/model",
      predict: "/prediction/predict",
      initiateLearning: "/initiate/learning"
    }
  },
  xolaCore: {
    baseUrl: "http://xola.local",
    services: {
      experiences: "/api/experiences"
    }
  }
};
