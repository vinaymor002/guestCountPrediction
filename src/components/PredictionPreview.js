import React, { Component } from "react";
import { Button, Row, Col } from "reactstrap";
import config from "../config";
import axios from "axios";
import PredictionResult from "./PredictionResult";
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
    baseURL: config.predictionService.baseUrl,
    timeout: 1000
  });

  componentWillReceiveProps() {
    this.setState({ isLoading: true });
    var client = new ApolloClient({
      uri: config.predictionService.baseUrl
    });
    console.log("THIS PROPS", this.props);
    if (this.props) {
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
          var trainedExperience = response.data.experience;
          this.setState({
            isLoading: false,
            experience: {
              ...this.props.experience,
              ...trainedExperience
            }
          });
        })
        .catch(error => console.error(error));
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 1000);
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
          <PredictionGraph />
          <PredictionTimeline />
          <PredictionTableView />
        </Row>
      );
    }
    return view;
  }
}

export default PredictionPreview;
