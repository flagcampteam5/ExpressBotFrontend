import React, { Component } from "react";
import GoogleMap from "google-map-react";
//import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import GoogleMapReact from "google-map-react";

const mapContainerStyle = {
  height: "100vh",
  width: "100vw",
};
const location = {
  address: "1600 Amphitheatre Parkway, Mountain View, california.",
  lat: 37.42216,
  lng: -122.08427,
};

class Map extends Component {
  render() {
    return (
      <div className="map">
        <h2>Map</h2>
        <GoogleMap
          google={this.props.google}
          style={{ width: "300px", height: "400px", position: "relative" }}
          bootstrapURLKeys={{ key: "AIzaSyDlJwq7vkMTDJZdiL_faErvEgozJJ4TCQ4" }}
          defaultCenter={location}
          defaultZoom={8}
        ></GoogleMap>
      </div>
    );
  }
}

export default Map;
