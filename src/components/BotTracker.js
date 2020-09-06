import React, { Component } from "react";
import { stations } from "../assets/facts";
import { Spin } from "antd";
import Map from "./Map";
import axios from "axios";

class BotTracker extends Component {
  constructor(props) {
    super(props);
    this.Map = React.createRef();
    this.status = "order placed";
    this.intervalID = null;
    this.state = {
      orderId: this.props.orderId,
      status_id: 0,
      station: stations[0],
      typeOfRobot: "Drone",
      pickUpLatLng: null,
      destinationLatLng: null,
      loading: true,
    };
    console.log(this.state.orderId, this.props.orderId);
    this.updateStatus = this.updateStatus.bind(this);
  }
  componentDidMount() {
    this.getData();
  }
  componentWillUnmount() {
    clearTimeout(this.intervalID);
  }
  getData() {
    var self = this;
    var url = "http://localhost:8080/expressbot/TrackOrder?order_id=";
    url += this.props.orderId;

    axios
      .get(url)
      .then(function (response) {
        console.log(response);

        self.setState({
          station: stations[parseInt(response.data.station_id[0]) - 1],
          pickUpLatLng: {
            lat: parseFloat(response.data.pickUpLat[0]),
            lng: parseFloat(response.data.pickUpLng[0]),
          },
          destinationLatLng: {
            lat: parseFloat(response.data.destinationLat[0]),
            lng: parseFloat(response.data.destinationLng[0]),
          },
          typeOfRobot:
            response.data.isRobot[0] === "true" ? "RoadBot" : "Drone",
          status_id: parseInt(response.data.status_id[0]),
          loading: false,
        });
        //self.render();
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(() => {
        //this.intervalID = setTimeout(this.getData.bind(this), 10000);
      });
  }
  render() {
    if (this.state.loading) {
      return (
        <div className="MapSpinner">
          <Spin spinning={this.state.loading} size="large" tip="loading..." />
        </div>
      );
    } else {
      return (
        <div className="MapContainer">
          <Map
            station={this.state.station}
            pickUpLatLng={this.state.pickUpLatLng}
            destinationLatLng={this.state.destinationLatLng}
            typeOfRobot={this.state.typeOfRobot}
            tracking={true}
            updateStatus={this.updateStatus}
            status_id={this.state.status_id}
            ref={this.Map}
          />
        </div>
      );
    }
  }
  renderMap = () => {
    if (!this.state.loading) {
      return (
        <div className="MapContainer">
          <this.Map
            station={this.state.station}
            pickUpLatLng={this.state.pickUpLatLng}
            destinationLatLng={this.state.destinationLatLng}
            typeOfRobot={this.state.typeOfRobot}
            tracking={true}
            updateStatus={this.updateStatus}
            status_id={this.state.status_id}
          />
        </div>
      );
    } else {
      return (
        <div className="MapContainer">
          <Map
            station={this.state.station}
            pickUpLatLng={this.state.pickUpLatLng}
            destinationLatLng={this.state.destinationLatLng}
            typeOfRobot={this.state.typeOfRobot}
            tracking={true}
            updateStatus={this.updateStatus}
            status_id={this.state.status_id}
            ref={this.Map}
          />
        </div>
      );
    }
  };

  updateStatus(status) {
    this.status = status;
    console.log(this.status);
    this.props.onProgressChange(this.state.status_id, this.status);
  }
}

export default BotTracker;
