import React, { Component } from "react";
import AddressAutocomplete from "../AddressAutocomplete";
import { Redirect, Link } from "react-router-dom";
import { Card, Form, Input, Button } from "antd";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";
import { GOOGLE_KEY } from "../../constants";
import Script from "react-load-script";
import image from "../../assets/images/RobotDelivery.jpeg";
class Service extends Component {
  constructor() {
    super();
    this.handleChangePickUp = this.handleChangePickUp.bind(this);
    this.handleChangeDestination = this.handleChangeDestination.bind(this);
    this.state = {
      googleMapsReady: false,
      redirect: false,
      pickUpLocation: "",
      destination: "",
    };
  }

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
  render() {
    return (
      <div className="service">
        <div className="Block">
          <p>
            {" "}
            This is the place where we put a short introduction to our service
          </p>
          <img src={image} alt="Delivery by robots" />
        </div>
        <div className="Background">
          <Card className="RequestCard" title="Request A Pick-Up">
            <Form>
              <Form.Item>
                <AddressAutocomplete placeholder="Enter Your Pick-Up Location" />
              </Form.Item>
              <Form.Item>
                <AddressAutocomplete placeholder="Enter Your Destination" />
              </Form.Item>
              <Form.Item>
                <Button className="Button" type="primary">
                  <Link
                    to={{
                      pathname: "/request",
                      state: {
                        pickUpLocation: this.state.pickUpLocation,
                        destination: this.state.destination,
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
      </div>
    );
  }
  handleSelectPickUp = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    this.setState({
      pickUpLocation: latLng,
    });
  };
  handleSelectDestination = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    this.setState({
      destination: latLng,
    });
  };
  handleChangePickUp = (e) => {
    this.setState({
      pickUpLocation: e.target.value,
    });
  };
  handleChangeDestination = (e) => {
    this.setState({
      destination: e.target.value,
    });
  };

  handleScriptLoad = () => {
    // Declare Options For Autocomplete
    const options = {
      types: ["(cities)"],
    }; // To disable any eslint 'google not defined' errors

    // Initialize Google Autocomplete
    /*global google*/ this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("autocomplete"),
      options
    );

    // Avoid paying for data that you don't need by restricting the set of
    // place fields that are returned to just the address components and formatted
    // address.
    this.autocomplete.setFields(["address_components", "formatted_address"]);

    // Fire Event when a suggested name is selected
    this.autocomplete.addListener("place_changed", this.handlePlaceSelect);
  };
}

export default Service;
