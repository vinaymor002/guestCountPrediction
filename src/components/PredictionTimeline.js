import React, { Component } from "react";
import { Button, Row, Col } from "reactstrap";
import "../styles/PredictionTimeline.css";
class PredictionTimeline extends Component {
  render() {
    return (
      <div className="prediction-timeline-container">
        <Row>
          <Col md={2}>
            <div> Header</div>
            <div> Picture</div>
            <div> Prediction </div>
          </Col>
          <Col md={2}>
            <div className="day-name"> Header</div>
            <div> Picture</div>
            <div className="prediction-result"> Prediction </div>
          </Col>
          <Col md={2}>
            <div> Header</div>
            <div> Picture</div>
            <div> Prediction </div>
          </Col>
          <Col md={2}>
            <div> Header</div>
            <div> Picture</div>
            <div> Prediction </div>
          </Col>
          <Col md={2}>
            <div> Header</div>
            <div> Picture</div>
            <div> Prediction </div>
          </Col>
          <Col md={2}>
            <div> Header</div>
            <div> Picture</div>
            <div> Prediction </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default PredictionTimeline;
