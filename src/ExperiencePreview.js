import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button } from "reactstrap";
import config from "./config";
import { Container, Row, Col, FormGroup, Input, Label } from "reactstrap";
import moment from "moment";

class ExperiencePreview extends Component {
  onDateChange = event => {
    this.props.updateDate(event.target.value);
  };
  //   renderOption = date => {
  //     return <option value={dates[i]}> {dates[i]}</option>;
  //   };
  render() {
    let experience = this.props.experience;
    let imageUrl;
    if (experience) {
      imageUrl = config.xolaCore.baseUrl + experience.photo.src;
    }
    let dates = [
      moment()
        .add(1, "days")
        .format("YYYY-MM-DD"),
      moment()
        .add(2, "days")
        .format("YYYY-MM-DD"),
      moment()
        .add(3, "days")
        .format("YYYY-MM-DD")
    ];

    let dateOptions = [];
    for (var i = 0; i < dates.length; i++) {
      dateOptions.push(<option value={dates[i]}> {dates[i]}</option>);
    }
    if (experience) {
      return (
        <Row>
          <Col md="6">
            <img width="250" src={imageUrl} />
          </Col>
          <Col md="6" className="experienceDescription">
            <Row>
              <h3> {experience.name} </h3>
            </Row>
            <Row>
              <p>{experience.desc} </p>
            </Row>
            <Row>
              <FormGroup>
                <Label for="exampleSelect">Select Date</Label>
                <Input
                  type="select"
                  name="select"
                  onChange={this.onDateChange}
                  id="exampleSelect"
                >
                  <option> Select Date... </option>
                  {dateOptions}
                </Input>
              </FormGroup>
            </Row>
          </Col>
        </Row>
      );
    }
    return "";
  }
}

export default ExperiencePreview;
