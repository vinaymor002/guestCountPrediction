import React, { Component } from "react";
import { Button, Row, Col } from "reactstrap";
import "../styles/PredictionTimeline.css";
import WeatherIcon from "react-icons-weather";
import moment from "moment";
class PredictionTimeline extends Component {
  getDailyPredictions() {
    let predictions = [];
    for (let i = 0; i < this.props.dailyPredictions.length; i++) {
      let nameOfDay = moment.unix(this.props.dailyPredictions[i].time);
      predictions.push(
        <Col md={1}>
          <div className={"timeline-item-header"}>
            {" "}
            {nameOfDay.format("ddd")}
          </div>
          <div className={"weather-icon-test"}>
            {" "}
            <WeatherIcon
              name="darksky"
              iconId={this.props.dailyPredictions[i].icon}
              flip="horizontal"
              rotate="90"
            />
          </div>
          <div className="cancelation-count">
            {this.props.dailyPredictions[i].guestCount}
          </div>
        </Col>
      );
    }
    return predictions;
  }
  render() {
    return (
      <div className="prediction-timeline-container">
        <Row>{this.getDailyPredictions()}</Row>
      </div>
    );
  }
}

export default PredictionTimeline;
