import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/App.css";
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

    fetch(
      process.env.REACT_APP_XOLA_CORE_URL +
        process.env.REACT_APP_XOLA_CORE_EXPERIENCES_API +
        "?seller=" +
        sellerId
    )
      .then(results => {
        return results.json();
      })
      .then(data => {
        this.experiences = data.data;
        this.fetchAddedExperiences(sellerId);
        this.setState({
          sellerId: sellerId,
          sellerApiKey: apiKey
        });
      });
  }

  fetchAddedExperiences = sellerId => {
    var client = new ApolloClient({
      uri: process.env.REACT_APP_PREDICTION_SERVICE_URL
    });

    client
      .query({
        variables: {
          sellerId: sellerId
        },
        query: gql`
          query Experience($sellerId: String) {
            experiences(sellerId: $sellerId) {
              experienceId
              indoor
              isTrained
              isEnabled
            }
          }
        `
      })
      .then(response => {
        var selectedExperiences = response.data.experiences;
        this.selectedExperiences = [];

        for (var i = 0; i < selectedExperiences.length; i++) {
          var experience = this.experiences.filter(experience => {
            return experience.id === selectedExperiences[i].experienceId;
          });
          this.experiences[this.experiences.indexOf(experience[0])] = {
            ...experience[0],
            ...selectedExperiences[i]
          };
        }

        this.setState({
          loading: false,
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
                sellerId={this.state.sellerId}
                apiKey={this.state.sellerApiKey}
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
