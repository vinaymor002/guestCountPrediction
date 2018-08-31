import React, { Component } from "react";
import { Row } from "reactstrap";
import axios from "axios";
import PredictionGraph from "./PredictionGraph";
import PredictionTimeline from "./PredictionTimeline";
import PredictionTableView from "./PredictionTableView";
import { RingLoader } from "react-spinners";
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import "../styles/PredictionPreview.css";

class PredictionPreview extends Component {
  state = {
    prediction: {},
    result: "",
    isLoading: true
  };
  client = axios.create({
    baseURL: process.env.REACT_APP_PREDICTION_SERVICE_URL,
    timeout: 1000
  });

  componentDidMount() {
    this.setState({ isLoading: true });
    var client = new ApolloClient({
      uri: process.env.REACT_APP_PREDICTION_SERVICE_URL
    });

    if (this.props) {
      console.log(this.props);
      var experienceId = this.props.experience.id;
      client
        .query({
          variables: {
            experienceId: experienceId,
            apiKey: this.props.apiKey
          },
          query: gql`
            query ExperienceItem($experienceId: String, $apiKey: String) {
              experience(experienceId: $experienceId, apiKey: $apiKey) {
                experienceId
                indoor
                isTrained
                isEnabled
              }
            }
          `
        })
        .then(response => {
          console.log(response);
          var trainedExperience = response.data.experience;
          client
            .query({
              variables: {
                experienceId: experienceId,
                apiKey: this.props.apiKey
              },
              query: gql`
                query Predictions($experienceId: String, $apiKey: String) {
                  prediction(experienceId: $experienceId, apiKey: $apiKey) {
                    experienceId
                    date
                    daily {
                      date
                      time
                      precipIntensity
                      precipProbability
                      temperature
                      apparentTemperature
                      dewPoint
                      humidity
                      pressure
                      windSpeed
                      windGust
                      windBearing
                      cloudCover
                      uvIndex
                      visibility
                      icon
                      guestCount
                    }
                    hourly {
                      date
                      time
                      precipIntensity
                      precipProbability
                      temperature
                      apparentTemperature
                      dewPoint
                      humidity
                      pressure
                      windSpeed
                      windGust
                      windBearing
                      cloudCover
                      uvIndex
                      visibility
                      icon
                      guestCount
                    }
                  }
                }
              `
            })
            .then(response => {
              console.log(response);
              var predictionResult = response.data.prediction;
              this.setState({
                isLoading: false,
                experience: {
                  ...this.props.experience,
                  ...trainedExperience
                },
                predictionResult: predictionResult
              });
            })
            .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
    }
  }

  render() {
    var view;
    if (this.state.isLoading) {
      view = (
        <div className="prediction-loader">
          <RingLoader size={150} color={"#36D7B7"} />
        </div>
      );
    } else {
      view = (
        <Row>
          <PredictionGraph
            hourlyPredictions={this.state.predictionResult.hourly}
          />
          <PredictionTimeline
            dailyPredictions={this.state.predictionResult.daily}
          />
          <PredictionTableView />
        </Row>
      );
    }
    return view;
  }
}

export default PredictionPreview;
