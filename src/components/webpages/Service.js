import React, { Component } from "react";
import AddressAutocomplete from "../AddressAutocomplete";
import { Redirect, Link } from "react-router-dom";
import { Card, Form, Button } from "antd";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import image from "../../assets/images/RobotDelivery.jpeg";

class Service extends Component {
  constructor() {
    super();
    this.handlePickUpAddress = this.handlePickUpAddress.bind(this);
    this.handlePickUpLatLng = this.handlePickUpLatLng.bind(this);
    this.handleDestinationAddress = this.handleDestinationAddress.bind(this);
    this.handleDestinationLatLng = this.handleDestinationLatLng.bind(this);
    this.state = {
      redirect: false,
      pickUpAddress: "",
      pickUpLatLng: null,
      destinationAddress: "",
      destinationLatLng: null,
    };
  }

  render() {
    return (
      <div className="service">
        <this.renderIntroBlock />
        <this.renderRequestCard />
      </div>
    );
  }
  renderIntroBlock = () => {
    return (
      <div className="Block">
        <div className="IntroBlock">
          <h1 style={{ color: "white" }}>
            This is the place where we put a short introduction to our service
          </h1>
        </div>
        <div className="RobotDeliveryImg">
          <img src={image} alt="Delivery by robots" />
        </div>
      </div>
    );
  };
  renderRequestCard = () => {
    return (
      <div className="Background">
        <Card className="RequestCard" title="Request A Pick-Up">
          <Form>
            <Form.Item>
              <AddressAutocomplete
                placeholder="Enter Your Pick-Up Location"
                onChangeAddress={this.handlePickUpAddress}
                onChangeLatLng={this.handlePickUpLatLng}
              />
            </Form.Item>
            <Form.Item>
              <AddressAutocomplete
                placeholder="Enter Your Destination"
                onChangeAddress={this.handleDestinationAddress}
                onChangeLatLng={this.handleDestinationLatLng}
              />
            </Form.Item>
            <Form.Item>
              <Button className="Button" type="primary">
                <Link
                  to={{
                    pathname: "/request",
                    state: {
                      pickUpAddress: this.state.pickUpAddress,
                      pickUpLatLng: this.state.pickUpLatLng,
                      destinationAddress: this.state.destinationAddress,
                      destinationLatLng: this.state.destinationLatLng,
                    },
                  }}
                >
                  Request
                </Link>
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  };
  setRedirect = () => {
    this.setState({
      redirect: true,
    });
  };
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/request" />;
    }
  };

  handlePickUpAddress = (address) => {
    this.setState({
      pickUpAddress: address,
    });
    console.log(
      "changed pickup address: ",
      this.state.pickUpAddress,
      this.state.pickUpLatLng
    );
  };
  handlePickUpLatLng = (latlng) => {
    this.setState({
      pickUpLatLng: latlng,
    });
    console.log(
      "changed pickup latlng: ",
      this.state.pickUpAddress,
      this.state.pickUpLatLng
    );
  };
  handleDestinationAddress = (address) => {
    this.setState({
      destinationAddress: address,
    });
    console.log(
      "changed destination address: ",
      this.state.destinationAddress,
      this.state.destinationLatLng
    );
  };
  handleDestinationLatLng = (latlng) => {
    this.setState({
      destinationLatLng: latlng,
    });
    console.log(
      "changed destination latlng: ",
      this.state.destinationAddress,
      this.state.destinationLatLng
    );
  };
}

export default Service;
