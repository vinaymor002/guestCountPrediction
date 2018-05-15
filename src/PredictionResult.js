import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button } from "reactstrap";
import config from "./config";
import { Container, Row, Col, FormGroup, Input, Label } from "reactstrap";
import moment from "moment";
import axios from "axios";

class PredictionResult extends Component {
  state = {
    result: ""
  };
  componentWillReceiveProps() {
    fetch(
      config.predictionService.baseUrl +
        config.predictionService.services.predict +
        "/" +
        this.props.experience.id +
        "?date=" +
        this.props.date
    )
      .then(results => {
        return results.json();
      })
      .then(data => {
        this.setState({ result: data.result });
      });
  }
  render() {
    return (
      <h4> Guest count for the selected date will be {this.state.result}</h4>
    );
  }
}

export default PredictionResult;
