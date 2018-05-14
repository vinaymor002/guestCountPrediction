import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button } from "reactstrap";
import config from "./config";
import Autosuggest from "react-autosuggest";
import {
  AutosuggestHighlightMatch,
  AutosuggestHighlightParse
} from "react-autosuggest";
// const getSuggestions = value => {
//   const inputValue = value.trim().toLowerCase();
//   const inputLength = inputValue.length;

//   return inputLength === 0
//     ? []
//     : languages.filter(
//         lang => lang.name.toLowerCase().slice(0, inputLength) === inputValue
//       );
// };

// // When suggestion is clicked, Autosuggest needs to populate the input
// // based on the clicked suggestion. Teach Autosuggest how to calculate the
// // input value for every given suggestion.
// const getSuggestionValue = suggestion => suggestion.name;

// // Use your imagination to render suggestions.
// const renderSuggestion = suggestion => <div>{suggestion.name}</div>;
const theme = {
  container: {
    position: "relative"
  },
  input: {
    width: 240,
    height: 30,
    padding: "10px 20px",
    fontFamily: "Helvetica, sans-serif",
    fontWeight: 300,
    fontSize: 16,
    border: "1px solid #aaa",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4
  },
  inputFocused: {
    outline: "none"
  },
  inputOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  suggestionsContainer: {
    display: "none"
  },
  suggestionsContainerOpen: {
    display: "block",
    position: "absolute",
    top: 51,
    width: 280,
    border: "1px solid #aaa",
    backgroundColor: "#fff",
    fontFamily: "Helvetica, sans-serif",
    fontWeight: 300,
    fontSize: 16,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    zIndex: 2
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  },
  suggestion: {
    cursor: "pointer",
    padding: "10px 20px"
  },
  suggestionHighlighted: {
    backgroundColor: "#ddd"
  }
};
class ExperienceSelector extends Component {
  state = {
    value: "",
    id: "",
    experiences: [],
    suggestions: []
  };
  experiences = [];
  componentWillMount() {
    fetch(
      config.xolaCore.baseUrl +
        config.xolaCore.services.experiences +
        "?seller=5a953f6d0bf8f2ed400041a8"
    )
      .then(results => {
        return results.json();
      })
      .then(data => {
        this.experiences = data.data;
        this.setState({ experiences: this.experiences });
      });
  }
  getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : this.experiences.filter(
          lang => lang.name.toLowerCase().slice(0, inputLength) === inputValue
        );
  };

  onSuggestionSelected = (event, options) => {
    this.props.updateExperience(options.suggestion);
  };
  renderSuggestion = suggestion => {
    return (
      <span className={"suggestion-content " + suggestion.twitter}>
        <span className="name">
          <span>{suggestion.name}</span>
        </span>
      </span>
    );
  };

  getSuggestionValue = suggestion => suggestion.name;
  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };
  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: "Type experience name",
      value,
      onChange: this.onChange
    };

    return (
      <div className="test">
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionSelected={this.onSuggestionSelected}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
        />
      </div>
    );
  }
}

export default ExperienceSelector;
