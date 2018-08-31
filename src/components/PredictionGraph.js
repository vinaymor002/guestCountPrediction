import React, { Component } from "react";
import chartkick from "chart.js";
import { AreaChart } from "react-chartkick";
import "../styles/PredictionGraph.css";
import moment from "moment";
class PredictionGraph extends Component {
  formatData(data) {
    var graphData = {};
    var graphData2 = {};
    var graphData3 = {};
    for (var i = 0; i < data.length; i++) {
      graphData[data[i]["timestamp"]] = data[i]["prediction"];
      graphData2[data[i]["timestamp"]] = data[i]["prediction"] + 15;
      graphData3[data[i]["timestamp"]] = Math.floor(Math.random() * 10 + 1);
    }

    return [
      { name: "Cancellation Prediction", data: graphData },
      { name: "Per Outing Maximum", data: graphData2 },
      { name: "Guest Count Booked", data: graphData3 }
    ];
  }

  render() {
    let data = [];

    for (var i = 0; i < 24; i++) {
      var time = moment.unix(this.props.hourlyPredictions[i].time);
      data.push({
        timestamp: time.format("h A"),
        prediction: this.props.hourlyPredictions[i].guestCount
      });
    }

    return (
      <div className="prediction-graph-container">
        <div>
          <h5>PREDICTION - TODAY</h5>
        </div>
        <div>
          <AreaChart
            legend="bottom"
            xtitle="Time"
            ytitle="Number of cancelations"
            width="800px"
            colors={["#ff4400", null, "blue"]}
            data={this.formatData(data)}
          />
        </div>
      </div>
    );
  }
}

export default PredictionGraph;
