import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import { GOOGLE_KEY } from "../constants";

const center = {
  lat: 37.773972,
  lng: -122.431297,
};

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pickUpAddress: this.props.pickUpAddress,
      pickUpLatLng: this.props.pickUpLatLng,
      destinationAddress: this.props.destinationAddress,
      destinationLatLng: this.props.destinationLatLng,
      typeOfRobot: this.props.typeOfRobot,
    };
  }

  render() {
    return (
      <div className="map">
        <GoogleMapReact
          google={this.props.google}
          style={{ width: "300px", height: "400px", position: "relative" }}
          bootstrapURLKeys={{ key: GOOGLE_KEY }}
          defaultCenter={center}
          defaultZoom={10}
          onGoogleApiLoaded={({ map, maps }) => this.renderRoute(map, maps)}
        ></GoogleMapReact>
      </div>
    );
  }
  renderRoute = (map, maps) => {
    console.log(this.state.typeOfRobot);
    //render a straight-line path if the robot is a drone
    if (this.props.typeOfRobot === "UAV") {
      let marker1 = new maps.Marker({
        position: this.state.pickUpLatLng,
        map,
      });
      let marker2 = new maps.Marker({
        position: this.state.destinationLatLng,
        map,
      });
      let straightLine = new maps.Polyline({
        path: [this.state.pickUpLatLng, this.state.destinationLatLng],
        map,
      });
      return [marker1, marker2, straightLine];
    }

    //render a bicycle route if the robot is a road bot
    else {
      let directionsService = new maps.DirectionsService();
      let directionsRenderer = new maps.DirectionsRenderer();
      const route = {
        origin: this.state.pickUpLatLng,
        destination: this.state.destinationLatLng,
        travelMode: "BICYCLING",
      };
      directionsRenderer.setMap(map);
      directionsService.route(route, function (response, status) {
        if (status !== "OK") {
          window.alert("Directions request failed due to " + status);
          return;
        } else {
          directionsRenderer.setDirections(response); // Add route to the map
          var directionsData = response.routes[0].legs[0];
          console.log("directionData", directionsData);
        }
      });
    }
  };
}

export default Map;
