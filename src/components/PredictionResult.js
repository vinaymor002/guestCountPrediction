import React, { Component } from "react";
import config from "../config";
import { Table } from "reactstrap";
import moment from "moment";
import axios from "axios";

class PredictionResult extends Component {
  state = {
    prediction: ""
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
        this.setState({ prediction: data });
      });
  }
  renderWeather(weatherData) {
    console.log(weatherData);
    let rows = weatherData.map((item, key) => {
      if (item.time == "0") {
        item.time = "000";
      }
      return (
        <tr>
          <td>
            <img src={item.weatherIconUrl[0].value} />
          </td>
          <td>
            <p>{item.weatherDesc[0].value}</p>
            <strong>
              {" "}
              Predicted number of guests:{" "}
              {this.state.prediction.result[key].prediction}{" "}
            </strong>
          </td>
          <td>
            <var> {moment(item.time, "hmm").format("h:mm a")} </var>
          </td>
        </tr>
      );
    });
    return rows;
  }
  render() {
    if (this.state.prediction.weather) {
      return (
        <Table>
          <tbody>{this.renderWeather(this.state.prediction.weather)}</tbody>
        </Table>
      );
    } else {
      return "";
    }
  }
}

export default PredictionResult;
