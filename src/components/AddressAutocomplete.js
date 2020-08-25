import React, { Component } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";
import { GOOGLE_KEY } from "../constants";
import { Spin } from "antd";

class AddressAutocomplete extends Component {
  render() {
    return (
      <div>
        <PlacesAutocomplete
          className="Autocomplete"
          apiKey={GOOGLE_KEY}
          placeholder={this.props.placeholder}
          loader={<Spin spinning={true} tip="Loading..." />}
          onSelect={({ description }) => {
            this.handleSelect(description);
          }}
          renderSuggestions={(active, suggestions, onSelectSuggestion) => (
            <div className="DropDown">
              {suggestions.map((suggestion) => (
                <div
                  className="suggestion"
                  key={suggestion.place_id}
                  onClick={(event) => onSelectSuggestion(suggestion, event)}
                >
                  {suggestion.description}
                </div>
              ))}
            </div>
          )}
        ></PlacesAutocomplete>
      </div>
    );
  }

  handleChange = (address) => {
    this.setState({ address });
  };

  handleSelect = (address) => {
    this.props.onChangeAddress(address);
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        this.props.onChangeLatLng(latLng);
      })
      .catch((error) => console.error("Error", error));
  };
}
export default AddressAutocomplete;
