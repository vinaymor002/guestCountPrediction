export default {
  predictionService: {
    baseUrl: "http://localhost:5000",
    services: {
      predictionModel: "/prediction/model",
      predict: "/prediction/predict",
      initiateLearning: "/initiate/learning"
    }
  },
  xolaCore: {
    baseUrl: "http://xola.local",
    services: {
      experiences: "/experiences"
    }
  }
};
