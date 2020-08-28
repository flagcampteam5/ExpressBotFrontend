import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import { stations, station1 } from "../assets/stations";
import { GOOGLE_KEY } from "../constants";

const center = {
  lat: 37.742011,
  lng: -122.525225,
};

class Map extends Component {
  constructor(props) {
    super(props);
    this.map = null;
    this.maps = null;
    this.markers = [];
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
          style={{ width: "100%", height: "100vh" }}
          bootstrapURLKeys={{ key: GOOGLE_KEY }}
          defaultCenter={center}
          defaultZoom={12.5}
          onGoogleApiLoaded={({ map, maps }) => this.renderMarkers(map, maps)}
        ></GoogleMapReact>
      </div>
    );
  }
  renderMarkers = (map, maps) => {
    if (this.markers.length > 0 && this.map !== null) {
      for (var i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(this.map);
      }
    } else {
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
      this.markers = [marker1, marker2];
    }
  };

  removeMarkers = () => {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
  };

  renderRoadbotRoute = () => {
    if (!this.state.roadbotRouteRendered) {
      this.removeMarkers();
      this.removeDroneRoute();
      console.log("rendring robot route");

      let roadBotDirectionsService = new this.maps.DirectionsService();
      let roadBotDirectionsRenderer = new this.maps.DirectionsRenderer();
      let closestStation = this.findClosestStation(
        this.state.pickUpLatLng,
        "RoadBot"
      );
      const route = {
        origin: closestStation,
        waypoints: [{ location: this.state.pickUpLatLng, stopover: true }],
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
      let closestStation = this.findClosestStation(
        this.state.pickUpLatLng,
        "Drone"
      );
      console.log(closestStation);
      let straightLine = new this.maps.Polyline({
        path: [
          closestStation,
          this.state.pickUpLatLng,
          this.state.destinationLatLng,
        ],
        strokeColor: "#c1e4f7",
        strokeWeight: 4,
      });
      this.removeRoadBotRoute();
      console.log("rendering drone route", straightLine);
      this.removeMarkers();

      //add a marker for the closest station
      this.markers.push(
        new this.maps.Marker({
          position: closestStation,
        })
      );
      this.renderMarkers(this.map, this.maps);
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
  findClosestStation = (location, typeOfRobot) => {
    if (typeOfRobot === "Drone") {
      var closest = stations[0];
      var minDistance = this.haversine_distance(stations[0], location);
      stations.forEach((station) => {
        let distance = this.haversine_distance(station, location);
        if (distance < minDistance) {
          closest = station;
          minDistance = distance;
        }
      });
      return closest;
    }
    if (typeOfRobot === "RoadBot") {
      let routeFinder = new this.maps.DirectionsService();
      var closestStation = stations[0];
      var minRoute = Number.MAX_VALUE;
      stations.forEach((station) => {
        var path = {
          origin: station,
          destination: this.state.pickUpLatLng,
          travelMode: "BICYCLING",
        };
        var route = routeFinder.route(path, function (response, status) {
          if (status !== "OK") {
            window.alert("Directions request failed due to " + status);
            return;
          } else {
            var directionsData = response.routes[0].legs[0];
            return directionsData;
          }
        });
        if (route && route.distance.value < minRoute) {
          closestStation = station;
          minRoute = route;
        }
      });

      return closestStation;
    }
  };

  //the following method of calculating distance using the Haversine formula
  //is adapted from https://cloud.google.com/blog/products/maps-platform/how-calculate-distances-map-maps-javascript-api
  haversine_distance(location1, location2) {
    var R = 3958.8; // Radius of the Earth in miles
    var rlat1 = location1.lat * (Math.PI / 180); // Convert degrees to radians
    var rlat2 = location2.lat * (Math.PI / 180); // Convert degrees to radians
    var difflat = rlat2 - rlat1; // Radian difference (latitudes)
    var difflon = (location2.lng - location1.lng) * (Math.PI / 180); // Radian difference (longitudes)

    var d =
      2 *
      R *
      Math.asin(
        Math.sqrt(
          Math.sin(difflat / 2) * Math.sin(difflat / 2) +
            Math.cos(rlat1) *
              Math.cos(rlat2) *
              Math.sin(difflon / 2) *
              Math.sin(difflon / 2)
        )
      );
    return d;
  }
}

export default Map;
