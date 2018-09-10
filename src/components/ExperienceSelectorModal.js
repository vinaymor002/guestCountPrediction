import React, {Component} from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  Alert
} from "reactstrap";
import ExperiencesList from "./ExperiencesList";

class ExperienceSelectorModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: true
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  updateSelectedExperiences = experiences => {
    this.experiences = experiences;
  };

  onSubmit = () => {
    this.props.updateSelectedExperiences(this.props.experiences);
    this.toggle();
  };

  render() {
    return (
      <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
        <ModalHeader toggle={this.toggle}>SELECT LISTINGS </ModalHeader>

        <ModalBody>
          <p>Select listings for which you want to create training models for predictions.</p>
          <Alert color="warning">Training models will take few minutes.</Alert>
          <ExperiencesList
            selectedExperiences={this.props.selectedExperiences}
            experiences={this.props.experiences}
            updateSelectedExperiences={this.updateSelectedExperiences}/>
        </ModalBody>

        <ModalFooter>
          <Button color="secondary" onClick={this.toggle}>Cancel</Button>{" "}
          <Button color="success" onClick={this.onSubmit}>Submit</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default ExperienceSelectorModal;
