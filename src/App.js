import React, { Component } from "react";
import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Container, Row, Col } from "reactstrap";
import ExperienceSelector from "./ExperienceSelector";
import ExperiencePreview from "./ExperiencePreview";
import PredictionPreview from "./PredictionPreview";
class App extends Component {
  state = {
    experience: "",
    date: ""
  };

  updateExperience = expValue => {
    this.setState({ experience: expValue });
  };

  updateDate = date => {
    this.setState({ date: date });
  };

  render() {
    return (
      <Container className="test">
        <Row>
          <Col md="8">
            <h2> Guest count prediction based on weather forecast </h2>
            <Row>
              <ExperienceSelector updateExperience={this.updateExperience} />
            </Row>
            <ExperiencePreview
              experience={this.state.experience}
              updateDate={this.updateDate}
            />
            <PredictionPreview
              date={this.state.date}
              experience={this.state.experience}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
