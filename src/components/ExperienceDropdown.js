import React, { Component } from "react";
import config from "../config";
import Autosuggest from "react-autosuggest";
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
  InputGroup,
  InputGroupAddon
} from "reactstrap";
import ExperienceSelectorModal from "./ExperienceSelectorModal";

class ExperienceDropdown extends Component {
  constructor(props) {
    super(props);
    this.client = new ApolloClient({
      uri: config.predictionService.baseUrl
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
    var selectedExperiences = [];
    for (var i = 0; i < this.props.selectedExperiences.length; i++) {
      var experience = _.where(this.props.experiences, {
        id: this.props.selectedExperiences[i].experienceId
      });
      if (this.props.selectedExperiences[i].isEnabled) {
        selectedExperiences.push({
          ...experience[0],
          ...this.props.selectedExperiences[i]
        });
      }
    }

    this.setState({ selectedExperiences: selectedExperiences });
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

  getSelectedExperiences = () => {
    var selectedExperiences = [];
    for (var i = 0; i < this.state.selectedExperiences.length; i++) {
      selectedExperiences.push(
        <DropdownItem
          key={this.state.selectedExperiences[i].id}
          className={
            this.state.selectedExperience ===
            this.state.selectedExperiences[i].id
              ? "active"
              : ""
          }
          id={this.props.experiences[i].id}
        >
          {this.props.experiences[i].name}
        </DropdownItem>
      );
    }
    return selectedExperiences;
  };

  updateSelectedExperiences = selectedExperiences => {
    var self = this;

    _.each(selectedExperiences, function(experience) {
      var originalExperience = _.where(self.props.experiences, {
        id: experience.id
      });
      experience = { ...experience, ...originalExperience[0] };
      var foundExperience = _.where(self.props.selectedExperiences, {
        experienceId: experience.id
      });

      if (foundExperience.length > 0) {
        self.updateSelectedExperience(experience);
      } else {
        self.createSelectedExperience(experience);
      }
    });
    this.setState({ selectedExperiences: selectedExperiences });
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
          mutation ExperienceCreate(
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
    this.client
      .mutate({
        variables: {
          experienceId: selectedExperience.id,
          sellerId: this.props.sellerId,
          indoor: selectedExperience.indoor,
          isEnabled: true
        },
        mutation: gql`
          mutation ExperienceUpdate(
            $experienceId: String
            $sellerId: String
            $indoor: Boolean
            $isEnabled: Boolean
          ) {
            createExperience(
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
                <Input
                  onKeyUp={this.searchExperience}
                  placeholder="Search For Listing"
                />
              </InputGroup>
            </DropdownItem>
            {this.getSelectedExperiences()}
            <DropdownItem divider />
            <DropdownItem id="showModal">
              <FaPlus size={15} /> {""}
              Add Listing
            </DropdownItem>
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
