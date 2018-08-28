import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/App.css";
import config from "../config";
import { Container, Row, Col } from "reactstrap";
import ExperienceDropdown from "./ExperienceDropdown";
// import ExperiencePreview from "./ExperiencePreview";
import { RingLoader } from "react-spinners";
import PredictionPreview from "./PredictionPreview";
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import queryString from "query-string";

class App extends Component {
  state = {
    experience: undefined,
    date: "",
    loading: true,
    selectedExperiences: [],
    sellerApiKey: "",
    sellerId: ""
  };

  componentDidMount() {
    const parsed = queryString.parse(window.location.hash);
    const apiKey = parsed.apiKey;
    const sellerId = parsed["?seller"];
    this.setState({
      sellerId: sellerId,
      sellerApiKey: apiKey
    });
    fetch(
      config.xolaCore.baseUrl +
        config.xolaCore.services.experiences +
        "?seller=" +
        sellerId
    )
      .then(results => {
        return results.json();
      })
      .then(data => {
        this.experiences = data.data;
        this.fetchAddedExperiences();
      });
  }

  fetchAddedExperiences = () => {
    var client = new ApolloClient({
      uri: config.predictionService.baseUrl
    });
    client
      .query({
        query: gql`
          query Experience {
            experiences(sellerId: "570b5ff46864ea3e288b45f6") {
              experienceId
              indoor
              isTrained
              isEnabled
            }
          }
        `
      })
      .then(response => {
        this.selectedExperiences = response.data.experiences;
        this.setState({
          loading: false,
          selectedExperiences: this.selectedExperiences,
          experiences: this.experiences
        });
      })
      .catch(error => console.error(error));
  };

  updateSelectedExperiences = addedExperience => {
    this.selectedExperiences.push(addedExperience);
    this.setState({ selectedExperiences: this.selectedExperiences });
  };

  selectExperience = expId => {
    var experience = this.state.experiences.filter(exp => {
      return exp.id === expId;
    })[0];
    this.setState({ experience: experience });
  };

  render() {
    var view;
    let predictionView;
    let experienceName;
    if (this.state.experience != undefined) {
      predictionView = (
        <PredictionPreview
          experience={this.state.experience}
          apiKey={this.state.sellerApiKey}
        />
      );
      experienceName = this.state.experience.name;
    }

    if (this.state.loading) {
      view = (
        <div className="welcome-loader">
          <RingLoader size={150} color={"#36D7B7"} />
        </div>
      );
    } else {
      view = (
        <Container className="test">
          <Row>
            <Col md="8">
              <h4> WEATHER BASED CANCELLATION PREDICTION </h4>
            </Col>
            <Col md="4">
              <ExperienceDropdown
                selectExperience={this.selectExperience}
                updateLoadingState={this.updateLoadingState}
                experiences={this.state.experiences}
                selectedExperiences={this.state.selectedExperiences}
                updateSelectedExperiences={this.fetchAddedExperiences}
              />
            </Col>
          </Row>
          <Row>
            <h4 className="experience-name">{experienceName}</h4>
          </Row>
          {predictionView}
        </Container>
      );
    }

    return view;
  }
}

export default App;
