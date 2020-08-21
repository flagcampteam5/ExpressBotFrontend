import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import { GOOGLE_KEY } from "../constants";

const location = {
  lat: 37.773972,
  lng: -122.431297,
};

class Map extends Component {
  render() {
    return (
      <div className="map">
        <GoogleMapReact
          google={this.props.google}
          style={{ width: "300px", height: "400px", position: "relative" }}
          bootstrapURLKeys={{ key: GOOGLE_KEY }}
          defaultCenter={location}
          defaultZoom={11}
          onGoogleApiLoaded={({ map, maps }) => this.renderMarkers(map, maps)}
        ></GoogleMapReact>
      </div>
    );
  }
  renderMarkers = (map, maps) => {
    let marker1 = new maps.Marker({
      position: location,
      map,
    });
    let marker2 = new maps.Marker({
      position: { lat: 40.773972, lng: -122.431297 },
      map,
    });
    return [marker1, marker2];
  };
}

export default Map;
