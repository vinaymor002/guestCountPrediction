import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button } from "reactstrap";
import config from "./config";
import { Container, Row, Col, FormGroup, Input, Label } from "reactstrap";
import moment from "moment";

class PredictionPreview extends Component {
  state = {
    prediction: {}
  };
  componentDidMount() {
    if (this.props.date) {
      fetch(
        config.predictionService.baseUrl +
          config.predictionService.services.predictionModel +
          "/" +
          this.props.experience.id
      )
        .then(results => {
          return results.json();
        })
        .then(data => {
          this.experiences = data.data;
          this.setState({ prediction: this.experiences });
        });
    }
  }
  componentDidUpdate() {
    if (this.props.date) {
      fetch(
        config.predictionService.baseUrl +
          config.predictionService.services.predictionModel +
          "/" +
          this.props.experience.id
      )
        .then(results => {
          return results.json();
        })
        .then(data => {
          this.experiences = data.data;
          this.setState({ prediction: this.experiences });
        });
    }
  }
  render() {
    let date = this.props.date;
    console.log(date);
    if (date) {
      return <Row> PredictionPreview </Row>;
    }
    return "";
  }
}

export default PredictionPreview;
