import React, { Component } from "react";
import { Table, Input } from "reactstrap";
import "../styles/ExperiencesList.css";
class ExperiencesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedExperiences: []
    };
  }

  componentDidMount() {
    console.log("HERE", this.props.selectedExperiences);
    this.setState({ selectedExperiences: this.props.selectedExperiences });
  }

  onCheckExperienceChange = event => {
    var selectedExperiences = this.state.selectedExperiences;

    var selectedExperience = selectedExperiences.filter(selectedExperience => {
      return selectedExperience.id === event.currentTarget.id;
    });

    if (selectedExperience.length > 0) {
      selectedExperiences[
        selectedExperiences.indexOf(selectedExperience[0])
      ].isEnabled = false;
    } else {
      selectedExperiences.push({
        id: event.currentTarget.id,
        indoor: false,
        isEnabled: true
      });
    }
    this.setState({ selectedExperiences: selectedExperiences });
    this.props.updateSelectedExperiences(selectedExperiences);
  };

  onOutdoorChange = event => {
    var selectedExperiences = this.state.selectedExperiences;
    var experience = selectedExperiences.filter(experience => {
      return experience.id === event.currentTarget.getAttribute("experience");
    });
    if (experience.length > 0) {
      var index = selectedExperiences.indexOf(experience[0]);
      selectedExperiences[index].indoor = false;
      this.setState({ selectedExperiences: selectedExperiences });
      this.props.updateSelectedExperiences(selectedExperiences);
    }
  };

  onIndoorChange = event => {
    var selectedExperiences = this.state.selectedExperiences;
    var experience = selectedExperiences.filter(experience => {
      return experience.id === event.currentTarget.getAttribute("experience");
    });
    if (experience.length > 0) {
      var index = selectedExperiences.indexOf(experience[0]);
      selectedExperiences[index].indoor = true;
      this.setState({ selectedExperiences: selectedExperiences });
      this.props.updateSelectedExperiences(selectedExperiences);
    }
  };

  getExperiences = () => {
    var experiences = [];
    for (var i = 0; i < this.props.experiences.length; i++) {
      var selectedExperience = this.state.selectedExperiences.filter(
        selectedExperience => {
          return (
            selectedExperience.id === this.props.experiences[i].id &&
            selectedExperience.isEnabled
          );
        }
      );
      console.log(this.props.selectedExperience);
      var checked = selectedExperience.length > 0;
      var indoor = false;
      if (checked) {
        indoor = selectedExperience[0].indoor;
      }
      experiences.push(
        <tr>
          <th scope="row">
            <Input
              type="checkbox"
              id={this.props.experiences[i].id}
              checked={checked}
              key={this.props.experiences[i].id}
              onChange={this.onCheckExperienceChange}
            />
          </th>
          <td>{this.props.experiences[i].name}</td>
          <td>
            <Input
              type="radio"
              className="outdoor"
              name={this.props.experiences[i].id}
              experience={this.props.experiences[i].id}
              key={this.props.experiences[i].id + "0"}
              checked={!indoor}
              onChange={this.onOutdoorChange}
            />
          </td>
          <td>
            <Input
              type="radio"
              className="indoor"
              name={this.props.experiences[i].id}
              experience={this.props.experiences[i].id}
              key={this.props.experiences[i].id + "1"}
              checked={indoor}
              onChange={this.onIndoorChange}
            />
          </td>
        </tr>
      );
    }
    return experiences;
  };

  render() {
    return (
      <Table borderless>
        <thead>
          <tr>
            <th />
            <th>Listing name</th>
            <th>Outdoor</th>
            <th>Indoor</th>
          </tr>
        </thead>
        <tbody>{this.getExperiences()}</tbody>
      </Table>
    );
  }
}

export default ExperiencesList;
