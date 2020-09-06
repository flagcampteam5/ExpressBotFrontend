import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import { stations } from "../assets/facts";
import { GOOGLE_KEY } from "../constants";
import { drone } from "../assets/images/drone.png";
import { Avatar } from "antd";

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
      roadbotRouteRendered: false,
      droneRouteRendered: false,
      currentLocationMarker: null,
      status_id: this.props.status_id,
    };
  }
  //componentWillReceiveProps(newProps) {
  //  console.log("received props", newProps.status_id);
  //  this.setState({
  //    status_id: newProps.status_id,
  //  });
  //  if (this.props.tracking && !this.props.isRobot) {
  //    this.renderDrone();
  //  }
  //}
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
    if (this.markers.length > 0 && this.map !== null) {
      for (var i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(this.map);
      }
    } else {
      this.map = map;
      this.maps = maps;
      console.log(
        "pickup",
        this.props.pickUpLatLng,
        "destination",
        this.props.destinationLatLng
      );
      let marker1 = new maps.Marker({
        position: this.props.pickUpLatLng,
        map,
      });
      let marker2 = new maps.Marker({
        position: this.props.destinationLatLng,
        map,
      });
      this.markers = [marker1, marker2];
    }
    if (this.props.tracking) {
      if (this.props.typeOfRobot === "RoadBot") {
        this.removeMarkers();
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
      let closestStation = this.findClosestStation(this.props.pickUpLatLng);
      const route = {
        origin: closestStation,
        waypoints: [{ location: this.props.pickUpLatLng, stopover: true }],
        destination: this.props.destinationLatLng,
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
      let closestStation = this.findClosestStation(this.props.pickUpLatLng);
      console.log(
        closestStation,
        this.props.pickUpLatLng,
        this.props.destinationAddress
      );
      let straightLine = new this.maps.Polyline({
        path: [
          closestStation,
          this.props.pickUpLatLng,
          this.props.destinationLatLng,
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
    var closest = 0;
    var minDistance = Number.MAX_VALUE;
    for (var i = 0; i < stations.length; i++) {
      let distance = this.haversine_distance(stations[i], location);
      if (distance < minDistance) {
        closest = i;
        minDistance = distance;
      }
    }
    this.props.onFoundStation(closest + 1);
    return stations[closest];
  };

  //the following method of calculating distance using the Haversine formula
  //is adapted from https://cloud.google.com/blog/products/maps-platform/how-calculate-distances-map-maps-javascript-api
  haversine_distance(location1, location2) {
    if (location1 === null || location2 === null) {
      console.log("null locations");
      return;
    }
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
        waypoints: [{ location: this.props.pickUpLatLng, stopover: true }],
        destination: this.props.destinationLatLng,
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
      let distanceAlongPath = segmentLength * this.state.status_id;
      console.log("totaldist", totalDistance, segmentLength, distanceAlongPath);
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
        console.log(
          "sanity check",
          this.haversine_distance(
            { lat: currentLat, lng: currentLng },
            this.props.station
          ),
          distanceAlongPath
        );
        this.props.updateStatus("heading to pick-up");
        this.updateCurrentLocation({ lat: currentLat, lng: currentLng });
      } else {
        let remainDistance = distanceAlongPath - distanceStationToPickUp;
        let currentLat =
          this.props.pickUpLatLng.lat +
          (this.props.destinationLatLng.lat - this.props.pickUpLatLng.lat) *
            (remainDistance / distancePickUpToDestination);
        let currentLng =
          this.props.pickUpLatLng.lng +
          (this.props.destinationLatLng.lng - this.props.pickUpLatLng.lng) *
            (remainDistance / distancePickUpToDestination);
        console.log(
          this.state.status_id,
          distanceAlongPath <
            distanceStationToPickUp + distancePickUpToDestination
        );
        console.log(
          "sanity check",
          this.haversine_distance(
            { lat: currentLat, lng: currentLng },
            this.props.pickUpLatLng
          ),
          distanceAlongPath
        );
        if (this.state.status_id === 19) {
          this.props.updateStatus("order completed!");
        } else {
          this.props.updateStatus("heading to destination");
        }

        this.updateCurrentLocation({ lat: currentLat, lng: currentLng });
      }
    }
  };

  //places a marker at the current location of the bot
  //and removes the marker at the previous location of the bot
  updateCurrentLocation(location) {
    if (this.props.typeOfRobot === "Drone") {
      console.log("rendering drone", location);
      if (this.currentLocationMarker) {
        this.currentLocationMarker.setMap(null);
      }

      let marker = new this.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        animation: this.maps.Animation.BOUNCE,
        icon: {
          path:
            "M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z",
          fillColor: "#fcc438",
          fillOpacity: 1,
          strokeColor: "",
          strokeWeight: 0,
        },
        map: this.map,
      });
      this.setState({
        currentLocationMarker: marker,
      });
    }
    if (this.props.typeOfRobot === "RoadBot") {
      console.log("rendering roadbot");
      if (this.currentLocationMarker) {
        this.currentLocationMarker.setMap(null);
      }
      let length = this.directions.overview.length;
      console.log(
        length,
        this.directions.overview[
          Math.floor((length / 19.0) * this.state.status_id) - 1
        ].lat(),
        Math.floor((length / 19.0) * this.state.status_id) - 1
      );
      let location;
      if (this.state.status_id === 0) {
        location = this.props.station;
      } else if (this.props.status === 19) {
        location = this.props.destinationLatLng;
      } else {
        location = this.directions.overview[
          Math.floor((length / 19.0) * this.state.status_id - 1)
        ];
      }
      console.log(this.directions.overview, location);

      let marker = new this.maps.Marker({
        position: { lat: location.lat(), lng: location.lng() },
        map: this.map,
        animation: this.maps.Animation.BOUNCE,
        icon: {
          path: "M22-48h-44v43h16l6 5 6-5h16z",
          fillColor: "#fcc438",
          fillOpacity: 1,
          strokeColor: "",
          strokeWeight: 0,
        },
      });
      this.setState({
        currentLocationMarker: marker,
      });
      let percent =
        Math.round((this.state.status_id / 19.0) * 100).toString() + "%";
      this.props.updateStatus(percent);
    }
  }
  currentStatus() {
    return this.status;
  }
}

export default Map;
