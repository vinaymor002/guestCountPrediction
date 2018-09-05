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
    this.setState({ experiences: this.props.experiences });
  }

  onCheckExperienceChange = event => {
    var experiences = this.props.experiences;
    var experience = experiences.filter(experience => {
      return experience.id === event.currentTarget.getAttribute("experience");
    });
    experiences[experiences.indexOf(experience[0])].isEnabled =
      event.target.checked;
    this.setState({ experiences: experiences });
  };

  onOutdoorChange = event => {
    var experiences = this.state.experiences;
    var experience = experiences.filter(experience => {
      return experience.id === event.currentTarget.getAttribute("experience");
    });
    if (experience.length > 0) {
      var index = experiences.indexOf(experience[0]);
      experiences[index].indoor = false;
      this.setState({ experiences: experiences });
      // this.props.updateSelectedExperiences(experiences);
    }
  };

  onIndoorChange = event => {
    var experiences = this.state.experiences;
    var experience = experiences.filter(experience => {
      return experience.id === event.currentTarget.getAttribute("experience");
    });
    if (experience.length > 0) {
      var index = experiences.indexOf(experience[0]);
      experiences[index].indoor = true;
      this.setState({ experiences: experiences });
      // this.props.updateSelectedExperiences(selectedExperiences);
    }
  };

  getExperiences = () => {
    var experiences = [];
    for (var i = 0; i < this.props.experiences.length; i++) {
      let checked = this.props.experiences[i].isEnabled;
      if (!checked) {
        checked = false;
      }
      var indoor = false;
      if (checked) {
        indoor = this.props.experiences[i].indoor;
      }
      experiences.push(
        <tr>
          <th scope="row">
            <Input
              experience={this.props.experiences[i].id}
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
