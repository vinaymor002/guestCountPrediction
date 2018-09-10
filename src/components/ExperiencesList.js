import React, {Component} from "react";
import {Input, Table} from "reactstrap";
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
    let experiences = this.props.experiences;

    let experience = experiences.filter(experience => {
      return experience.id === event.currentTarget.getAttribute("experience");
    });
    experiences[experiences.indexOf(experience[0])].isEnabled = event.target.checked;
    this.setState({ experiences: experiences });
  };

  onOutdoorChange = event => {
    let experiences = this.state.experiences;
    let experience = experiences.filter(experience => {
      return experience.id === event.currentTarget.getAttribute("experience");
    });
    if (experience.length > 0) {
      let index = experiences.indexOf(experience[0]);
      experiences[index].indoor = false;
      this.setState({ experiences: experiences });
    }
  };

  onIndoorChange = event => {
    let experiences = this.state.experiences;
    let experience = experiences.filter(experience => {
      return experience.id === event.currentTarget.getAttribute("experience");
    });
    if (experience.length > 0) {
      let index = experiences.indexOf(experience[0]);
      experiences[index].indoor = true;
      this.setState({ experiences: experiences });
    }
  };

  getExperiences = () => {
    return this.props.experiences.map((experience) => {
      let checked = experience.isEnabled;
      if (!checked) {
        checked = false;
      }
      let indoor = false;
      if (checked) {
        indoor = experience.indoor;
      }

      return <tr key={experience.id}>
        <th scope="row">
          <Input
            experience={experience.id}
            type="checkbox"
            id={experience.id}
            checked={checked}
            key={experience.id}
            onChange={this.onCheckExperienceChange}
          />
        </th>
        <td>{experience.name}</td>
        <td>
          <Input
            type="radio"
            className="outdoor"
            name={experience.id}
            experience={experience.id}
            key={experience.id + "0"}
            checked={!indoor}
            onChange={this.onOutdoorChange}
          />
        </td>
        <td>
          <Input type="radio"
                 className="indoor"
                 name={experience.id}
                 experience={experience.id}
                 key={experience.id + "1"}
                 checked={indoor}
                 onChange={this.onIndoorChange}
          />
        </td>
      </tr>
    });
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
