import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import { stations } from "../assets/facts";
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
    this.directions = null;

    this.state = {
      pickUpAddress: this.props.pickUpAddress,
      pickUpLatLng: this.props.pickUpLatLng,
      destinationAddress: this.props.destinationAddress,
      destinationLatLng: this.props.destinationLatLng,
      roadbotRouteRendered: false,
      droneRouteRendered: false,
      typeOfRobot: this.props.typeOfRobot,
      currentLocationMarker: null,
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
          yesIwanttouseGoogleMapApiInternal={true}
          onGoogleApiLoaded={({ map, maps }) => {
            this.renderMarkers(map, maps);
          }}
        ></GoogleMapReact>
      </div>
    );
  }
  renderMarkers = (map, maps) => {
    console.log(
      "pickup",
      this.state.pickUpLatLng,
      "destination",
      this.state.destinationLatLng
    );
    if (this.markers.length > 0 && this.map !== null) {
      for (var i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(this.map);
      }
    } else {
      this.map = map;
      this.maps = maps;
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
    if (this.props.tracking) {
      if (this.props.typeOfRobot === "RoadBot") {
        this.renderRoadBot();
      } else {
        let stationMarker = new maps.Marker({
          position: this.props.station,
          map,
        });
        stationMarker.setMap(map);
        this.renderDrone();
      }
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
      var self = this;
      let roadBotDirectionsService = new this.maps.DirectionsService();
      let roadBotDirectionsRenderer = new this.maps.DirectionsRenderer();
      let closestStation = this.findClosestStation(this.state.pickUpLatLng);
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
          self.directions = response.routes[0].overview_path;
        }
      });
      this.roadBotDirectionsRenderer = roadBotDirectionsRenderer;
      this.roadBotDirectionsService = roadBotDirectionsService;
      this.setState({
        roadbotRouteRendered: true,
      });
      console.log("directions2", this.directions);
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
      let closestStation = this.findClosestStation(this.state.pickUpLatLng);
      console.log(closestStation);
      let straightLine = new this.maps.Polyline({
        path: [
          closestStation,
          this.state.pickUpLatLng,
          this.state.destinationLatLng,
        ],
        strokeColor: "#3870fc",
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
  findClosestStation = (location) => {
    var closest = stations[0];
    var minDistance = Number.MAX_VALUE;
    stations.forEach((station) => {
      let distance = this.haversine_distance(station, location);
      if (distance < minDistance) {
        closest = station;
        minDistance = distance;
      }
    });
    return closest;
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

  //when tracking, put a marker at the location of the roadbot based on a status_id returned from backend
  renderRoadBot = () => {
    var self = this;
    if (!this.directions) {
      let roadBotDirectionsService = new this.maps.DirectionsService();
      let roadBotDirectionsRenderer = new this.maps.DirectionsRenderer();
      const route = {
        origin: this.props.station,
        waypoints: [{ location: this.state.pickUpLatLng, stopover: false }],
        destination: this.state.destinationLatLng,
        travelMode: "BICYCLING",
      };
      roadBotDirectionsRenderer.setMap(this.map);
      roadBotDirectionsService.route(route, (response, status) => {
        if (status !== "OK") {
          window.alert("Directions request failed due to " + status);
          return;
        } else {
          roadBotDirectionsRenderer.setDirections(response); // Add route to the map
          var directionsData1 = response.routes[0].legs[0];
          var directionsData2 = response.routes[0].legs[1];
          self.directions = {
            overview: response.routes[0].overview_path,
            segment1: directionsData1,
            segment2: directionsData2,
          };
          self.updateCurrentLocation();
        }
      });
    }
  };

  //when tracking, put a marker at the location of the drone based on a status_id returned from backend
  renderDrone = () => {
    if (!this.directions) {
      let distanceStationToPickUp = this.haversine_distance(
        this.props.station,
        this.props.pickUpLatLng
      );
      let distancePickUpToDestination = this.haversine_distance(
        this.props.pickUpLatLng,
        this.props.destinationLatLng
      );
      let totalDistance = distanceStationToPickUp + distancePickUpToDestination;
      let segmentLength = totalDistance / 19.0;
      let distanceAlongPath = segmentLength * this.props.status_id;
      let lineStationToPickUp = new this.maps.Polyline({
        path: [this.props.station, this.props.pickUpLatLng],
        strokeColor: "#3870fc",
        strokeWeight: 4,
      });
      let linePickUpToDestination = new this.maps.Polyline({
        path: [this.props.pickUpLatLng, this.props.destinationLatLng],
        strokeColor: "#3870fc",
        strokeWeight: 4,
      });
      lineStationToPickUp.setMap(this.map);
      linePickUpToDestination.setMap(this.map);
      if (distanceAlongPath <= distanceStationToPickUp) {
        let currentLat =
          this.props.station.lat +
          (this.props.pickUpLatLng.lat - this.props.station.lat) *
            (distanceAlongPath / distanceStationToPickUp);
        let currentLng =
          this.props.station.lng +
          (this.props.pickUpLatLng.lng - this.props.station.lng) *
            (distanceAlongPath / distanceStationToPickUp);
        this.props.updateStatus("heading to pick-up");
        this.updateCurrentLocation({ lat: currentLat, lng: currentLng });
      } else {
        let remainDistance = distanceAlongPath - distanceStationToPickUp;
        let currentLat =
          this.props.pickUpLatLng.lat +
          (this.props.destinationLatLng.lat - this.props.pickUpLatLng.lat) *
            (remainDistance / distanceStationToPickUp);
        let currentLng =
          this.props.pickUpLatLng.lng +
          (this.props.destinationLatLng.lng - this.props.pickUpLatLng.lng) *
            (remainDistance / distanceStationToPickUp);
        //this.status = "heading to destination";
        this.props.updateStatus("heading to destination");
        this.updateCurrentLocation({ lat: currentLat, lng: currentLng });
      }
    }
  };

  //places a marker at the current location of the bot
  //and removes the marker at the previous location of the bot
  updateCurrentLocation(location) {
    if (this.props.typeOfRobot === "Drone") {
      if (this.currentLocationMarker) {
        this.currentLocationMarker.setMap(null);
      }
      let marker = new this.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: this.map,
      });
      this.setState({
        currentLocationMarker: marker,
      });
    }
    if (this.props.typeOfRobot === "RoadBot") {
      if (this.currentLocationMarker) {
        this.currentLocationMarker.setMap(null);
      }
      let length = this.directions.overview.length;
      let location = this.directions.overview[
        Math.floor((length / 19.0) * this.props.status_id)
      ];

      let marker = new this.maps.Marker({
        position: { lat: location.lat(), lng: location.lng() },
        map: this.map,
      });
      this.setState({
        currentLocationMarker: marker,
      });
      let percent =
        Math.round((this.props.status_id / 19.0) * 100).toString() + "%";
      this.props.updateStatus(percent);
    }
  }
  currentStatus() {
    return this.status;
  }
}

export default Map;
