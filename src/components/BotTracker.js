import React, { Component } from "react";
import { stations } from "../assets/facts";
import Map from "./Map";

class BotTracker extends Component {
  constructor(props) {
    super(props);
    this.Map = React.createRef();
    this.status = "order placed";
    this.state = {
      orderId: this.props.orderId,
      status_id: 10,
      station: stations[0],
      typeOfRobot: "Drone",
      pickUpLatLng: stations[1],
      destinationLatLng: stations[2],
    };
    this.updateStatus = this.updateStatus.bind(this);
  }
  render() {
    console.log(this.props.onProgressChange);
    return (
      console.log("pickup", this.state.pickUpLatLng),
      (
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
      )
    );
  }

  updateStatus(status) {
    this.status = status;
    console.log(this.status);
    this.props.onProgressChange(this.state.status_id, this.status);
  }
}

export default BotTracker;
