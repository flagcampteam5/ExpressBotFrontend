import React, { Component } from "react";
import { Card, Form, Button } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";

class Confirmation extends Component {
  render() {
    return (
      <Card className="Card" title="Thank You For Your Order!">
        <Form>
          <Form.Item>
            <ul>
              <li>Order Number: {this.props.orderId}</li>
              {this.props.customerEmail !== null ? (
                <li>
                  Order placed by:
                  {this.props.customerEmail}
                </li>
              ) : null}
              <li>Pick-up location: {this.props.pickUpAddress}</li>
              <li>Destination: {this.props.destinationAddress}</li>

              <li>
                Estimated Delivery Time: {this.props.estimatedDeliveryTime.hour}
                :{this.props.estimatedDeliveryTime.minute}
              </li>
              <li>Order total: $10</li>
            </ul>
          </Form.Item>
          <Form.Item>
            <Button className="Button" type="primary">
              <Link
                to={{
                  pathname: "/tracking",
                  state: {
                    orderId: this.props.orderId,
                  },
                }}
              >
                Track Order
              </Link>
            </Button>
          </Form.Item>
          <Form.Item>
            <Button className="Button" type="primary">
              <Link to="/">Place Another Order</Link>
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
  componentDidMount() {
    var self = this;
    axios
      .post("http://localhost:8080/expressbot/PlaceOrder", {
        pickUpLat: self.props.pickUpLatLng.lat,
        pickUpLng: self.props.pickUpLatLng.lng,
        destinationLat: self.props.destinationLatLng.lat,
        destinationLng: self.props.destinationLatLng.lng,
        order_id: self.props.orderId,
        station_id: self.props.stationId,
        isRobot: self.props.isRobot,
        timestamp: 1234455,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}
export default Confirmation;
