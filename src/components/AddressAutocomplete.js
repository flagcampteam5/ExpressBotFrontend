import React, { Component } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";
import { GOOGLE_KEY } from "../constants";

class AddressAutocomplete extends Component {
  constructor(props) {
    super(props);
    this.state = { places: [] };
  }

  render() {
    return (
      <div>
        <PlacesAutocomplete
          className="Autocomplete"
          apiKey={GOOGLE_KEY}
          placeholder={this.props.placeholder}
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
          //value={this.state.address}
          //onChange={this.handleChange}
          //onSelect={this.handleSelect}
        ></PlacesAutocomplete>
      </div>
    );
  }

  handleChange = (address) => {
    this.setState({ address });
  };

  handleSelect = (address) => {
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => console.log("Success", latLng))
      .catch((error) => console.error("Error", error));
  };
}
export default AddressAutocomplete;
