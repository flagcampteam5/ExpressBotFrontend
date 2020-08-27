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
    this.map = null;
    this.maps = null;
    this.roadBotDirectionsService = null;
    this.roadBotDirectionsRenderer = null;
    this.droneRoute = null;
    this.state = {
      pickUpAddress: this.props.pickUpAddress,
      pickUpLatLng: this.props.pickUpLatLng,
      destinationAddress: this.props.destinationAddress,
      destinationLatLng: this.props.destinationLatLng,
      roadbotRouteRendered: false,
      droneRouteRendered: false,
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
          defaultZoom={12}
          onGoogleApiLoaded={({ map, maps }) => this.renderMarkers(map, maps)}
        ></GoogleMapReact>
      </div>
    );
  }
  renderMarkers = (map, maps) => {
    this.map = map;
    this.maps = maps;
    console.log(this.map, this.maps);
    let marker1 = new maps.Marker({
      position: this.state.pickUpLatLng,
      map,
    });
    let marker2 = new maps.Marker({
      position: this.state.destinationLatLng,
      map,
    });
    return [marker1, marker2];
  };

  renderRoadbotRoute = () => {
    if (!this.state.roadbotRouteRendered) {
      this.removeDroneRoute();
      console.log("rendring robot route");
      let roadBotDirectionsService = new this.maps.DirectionsService();
      let roadBotDirectionsRenderer = new this.maps.DirectionsRenderer();
      const route = {
        origin: this.state.pickUpLatLng,
        destination: this.state.destinationLatLng,
        travelMode: "BICYCLING",
      };
      roadBotDirectionsRenderer.setMap(this.map);
      roadBotDirectionsService.route(route, function (response, status) {
        if (status !== "OK") {
          window.alert("Directions request failed due to " + status);
          return;
        } else {
          roadBotDirectionsRenderer.setDirections(response); // Add route to the map
          var directionsData = response.routes[0].legs[0];
          console.log("directionData", directionsData);
        }
      });
      this.roadBotDirectionsRenderer = roadBotDirectionsRenderer;
      this.roadBotDirectionsService = roadBotDirectionsService;
      this.setState({
        roadbotRouteRendered: true,
      });
    }
  };
  removeRoadBotRoute = () => {
    if (this.state.roadbotRouteRendered) {
      this.roadBotDirectionsRenderer.setMap(null);
      this.setState({
        roadbotRouteRendered: false,
      });
    }
  };
  renderDroneRoute = () => {
    if (!this.state.droneRouteRendered) {
      let straightLine = new this.maps.Polyline({
        path: [this.state.pickUpLatLng, this.state.destinationLatLng],
        strokeColor: "#c1e4f7",
        strokeWeight: 4,
      });
      this.removeRoadBotRoute();
      console.log("rendering drone route");
      this.droneRoute = straightLine;
      this.droneRoute.setMap(this.map);
    }
    this.setState({
      droneRouteRendered: true,
    });
  };
  removeDroneRoute = () => {
    if (this.state.droneRouteRendered) {
      this.droneRoute.setMap(null);
      this.setState({
        droneRouteRendered: false,
      });
    }
  };
}

export default Map;
