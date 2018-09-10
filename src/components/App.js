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
import _ from "underscore";

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
    let params = (new URL(document.location)).searchParams;
    let sellerId = params.get('seller');
    let apiKey = params.get('apiKey');
    this.setState({
      sellerId: sellerId,
      sellerApiKey: apiKey
    });

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
        this.xolaExperiences = data.data;
        this.fetchRegisteredExperiences(sellerId);
      });
  }

  fetchRegisteredExperiences = sellerId => {
    let self = this
    let client = new ApolloClient({
      uri: process.env.REACT_APP_PREDICTION_SERVICE_URL
    });

    client.query({
        variables: {
          sellerId: sellerId
        },
        query: gql`
          query Experience($sellerId: String) {
            experiences(sellerId: $sellerId) {
              _id
              experienceId
              indoor
              isTrained
              isEnabled
            }
          }
        `
      })
      .then(response => {
        let registeredExperiences = response.data.experiences;

        let experiences = self.xolaExperiences.map(xolaExperience => {
          let experience = {name: xolaExperience.name, id: xolaExperience.id};
          let registeredExperience = _.findWhere(registeredExperiences, {experienceId: xolaExperience.id});
          if (registeredExperience) {
            experience = _.extend(experience, registeredExperience);
          }
          return experience;
        });

        this.setState({
          loading: false,
          experiences: experiences
        });
      })
      .catch(error => console.error(error));
  };

  updateSelectedExperiences = addedExperience => {
    this.selectedExperiences.push(addedExperience);
    this.setState({ selectedExperiences: this.selectedExperiences });
  };

  selectExperience = expId => {
    let experience = this.state.experiences.filter(exp => {
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
                updateSelectedExperiences={this.fetchRegisteredExperiences}
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
