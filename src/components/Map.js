import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import { GOOGLE_KEY } from "../constants";

const center = {
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
          defaultCenter={center}
          defaultZoom={10}
          onGoogleApiLoaded={({ map, maps }) => this.renderMarkers(map, maps)}
        ></GoogleMapReact>
      </div>
    );
  }
  renderMarkers = (map, maps) => {
    let marker1 = new maps.Marker({
      position: this.props.pickUpLatLng,
      map,
    });
    let marker2 = new maps.Marker({
      position: this.props.destinationLatLng,
      map,
    });
    return [marker1, marker2];
  };
}

export default Map;
