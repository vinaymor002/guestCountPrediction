import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button } from "reactstrap";
import config from "./config";
import { Container, Row, Col, FormGroup, Input, Label } from "reactstrap";
import moment from "moment";
import axios from "axios";
import PredcictionResult from "./PredictionResult";
import PredictionResult from "./PredictionResult";

class PredictionPreview extends Component {
  state = {
    prediction: {},
    result: ""
  };
  client = axios.create({
    baseURL: config.predictionService.baseUrl,
    timeout: 1000
  });

  componentWillReceiveProps() {
    if (this.props.date) {
      this.client
        .get(
          config.predictionService.services.predictionModel +
            "/" +
            this.props.experience.id,
          {
            mode: "no-cors",
            method: "HEAD"
          }
        )
        .then(response => {
          this.setState({ prediction: response.data });
        })
        .catch(error => {
          this.setState({ prediction: { status: 0 } });
        });
    }
  }

  render() {
    let date = this.props.date;
    console.log(moment(0).format("h:mm a"));
    if (date && (!this.state.prediction || this.state.prediction.status == 0)) {
      return <Button className="btn btn-success"> Initiate Learning</Button>;
    } else if (date && this.state.prediction.status == 1) {
      return (
        <PredictionResult
          experience={this.props.experience}
          date={this.props.date}
        />
      );
    }
    return "";
  }
}

export default PredictionPreview;
