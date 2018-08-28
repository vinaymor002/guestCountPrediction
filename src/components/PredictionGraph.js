import React, { Component } from "react";
import config from "../config";
import { Row, Col, FormGroup, Input, Label } from "reactstrap";
import chartkick from "chart.js";
import { AreaChart } from "react-chartkick";
import "../styles/PredictionGraph.css";
import moment from "moment";
class PredictionGraph extends Component {
  formatData(data) {
    var graphData = {};
    for (var i = 0; i < data.length; i++) {
      graphData[data[i]["timestamp"]] = data[i]["prediction"];
    }

    return graphData;
  }

  render() {
    let data = [];
    var date = moment(Date.now());
    for (var i = 1; i <= 24; i++) {
      data.push({
        timestamp: date.add(1, "Hours").format("h A"),
        prediction: Math.floor(Math.random() * 20 + 1)
      });
    }

    return (
      <div className="prediction-graph-container">
        <div>
          <h5>PREDICTION - TODAY</h5>
        </div>
        <div>
          <AreaChart
            width="800px"
            colors={["#ff4400"]}
            data={this.formatData(data)}
          />
        </div>
      </div>
    );
  }
}

export default PredictionGraph;
