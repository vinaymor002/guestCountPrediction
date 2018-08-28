import React, { Component } from "react";
import { Button, Row, Col, Table } from "reactstrap";
import "../styles/PredictionTableView.css";
class PredictionTableView extends Component {
  render() {
    return (
      <div className="prediction-table-view-container">
        <Table bordered>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Average Weather</th>
              <th>Predicted cancelation count</th>
              <th>Per outing maximum</th>
              <th>Guest count booked so far</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Mark</td>
              <td>Mark</td>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Mark</td>
              <td>Mark</td>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Mark</td>
              <td>Mark</td>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }
}

export default PredictionTableView;
