import React, { Component } from "react";

import "../styles/ExperienceSelector.css";
import { FaSearch, FaPlus } from "react-icons/fa";
import matchSorter from "match-sorter";
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import _ from "underscore";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  InputGroup
} from "reactstrap";
import ExperienceSelectorModal from "./ExperienceSelectorModal";

class ExperienceDropdown extends Component {
  constructor(props) {
    super(props);
    this.client = new ApolloClient({
      uri: process.env.REACT_APP_PREDICTION_SERVICE_URL
    });
    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
      showModal: false,
      selectedExperience: "",
      selectedExperienceName: "Select Listing",
      selectedExperiences: []
    };
  }

  componentDidMount() {
    this.setState({ selectedExperiences: this.props.selectedExperiences });
  }

  toggle(event) {
    var elementId = event.target.id;
    var stateToBeSet = {
      dropdownOpen: !this.state.dropdownOpen
    };

    if (elementId === "showModal") {
      stateToBeSet.showModal = true;
    } else if (elementId !== "") {
      stateToBeSet.selectedExperience = elementId;
      stateToBeSet.selectedExperienceName = event.currentTarget.textContent;
      this.props.selectExperience(elementId);
    } else if (this.state.selectedExperience) {
      stateToBeSet.selectedExperience = this.state.selectedExperience;
      stateToBeSet.selectedExperienceName = this.state.selectedExperienceName;
    }

    this.setState(stateToBeSet);
  }

  searchExperience = event => {
    var foundExperiences = matchSorter(
      this.state.selectedExperiences,
      event.target.value,
      {
        keys: ["name"]
      }
    );

    if (foundExperiences.length > 0) {
      this.setState({ selectedExperiences: foundExperiences });
    }
  };

  dropdownItems = () => {
    return this.getSelectedExperiences().map(experience => {
      return <DropdownItem key={experience.id} className={this.isActive(experience) ? "active" : ""} id={experience.id}>
        {experience.name}
      </DropdownItem>
    }, this);
  };

  isActive(experience) {
    return this.state.selectedExperience === experience.id;
  }

  getSelectedExperiences = () => {
    return this.props.experiences.filter(experience => {
      return experience.isEnabled;
    });
  };

  updateSelectedExperiences = experiences => {
    let self = this;

    _.each(experiences, experience => {
      if (experience._id) {
        self.updateSelectedExperience(experience)
      } else if (experience.isEnabled) {
        self.createSelectedExperience(experience)
      }
    });

    // this.setState({ selectedExperiences: selectedExperiences });
  };

  updateSelectedExperience = selectedExperience => {
    console.log(selectedExperience);
    this.client
      .mutate({
        variables: {
          experienceId: selectedExperience.id,
          sellerId: this.props.sellerId,
          indoor: selectedExperience.indoor,
          isEnabled: selectedExperience.isEnabled
        },
        mutation: gql`
          mutation ExperienceUpdate(
            $experienceId: String
            $sellerId: String
            $indoor: Boolean
            $isEnabled: Boolean
          ) {
            updateExperience(
              input: {
                sellerId: $sellerId
                experienceId: $experienceId
                indoor: $indoor
                isEnabled: $isEnabled
              }
            ) {
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
        var experienceData = response.data.createExperience;
        console.log(response);
      })
      .catch(error => console.error(error));
  };

  createSelectedExperience = selectedExperience => {
    console.log(this.props.apiKey, "API KEY");
    this.client
      .mutate({
        variables: {
          experienceId: selectedExperience.id,
          sellerId: this.props.sellerId,
          indoor: selectedExperience.indoor,
          isEnabled: true,
          apiKey: this.props.apiKey
        },
        mutation: gql`
          mutation ExperienceCreate(
            $experienceId: String
            $sellerId: String
            $indoor: Boolean
            $isEnabled: Boolean
            $apiKey: String
          ) {
            createExperience(
              input: {
                sellerId: $sellerId
                experienceId: $experienceId
                indoor: $indoor
                isEnabled: $isEnabled
              }
              apiKey: $apiKey
            ) {
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
        let experienceData = response.data.createExperience;
      })
      .catch(error => console.error(error));
  };

  render() {
    return (
      <div className="experience-selector-container">
        <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>

          <DropdownToggle outline={true} color="secondary" caret>
            {this.state.selectedExperienceName}
          </DropdownToggle>

          <DropdownMenu>
            <DropdownItem disabled>
              <InputGroup>
                <FaSearch />
                <Input onKeyUp={this.searchExperience} placeholder="Search For Listing"/>
              </InputGroup>
            </DropdownItem>

            {this.dropdownItems()}

            <DropdownItem divider />

            <DropdownItem id="showModal"><FaPlus size={15} /> {""}Add Listing</DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
        {(() => {
          if (this.state.showModal) {
            this.state.showModal = false;
            return (
              <ExperienceSelectorModal
                selectedExperiences={this.state.selectedExperiences}
                experiences={this.props.experiences}
                updateSelectedExperiences={this.updateSelectedExperiences}
              />
            );
          }
        })()}
      </div>
    );
  }
}

export default ExperienceDropdown;
