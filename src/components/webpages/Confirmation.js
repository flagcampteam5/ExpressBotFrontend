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
      .get("https://dog.ceo/api/breeds/list/all", {})
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
        console.log(
          "pickup data type: ",
          self.props.pickUpLatLng.lat.type,
          self.props.pickUpLatLng.lat,
          self.props.pickUpLatLng.lng,
          self.props.orderId.type,
          self.props.stationId,
          self.props.isRobot,
          self.props.pickUpLatLng.lat,
          self.props.destinationLatLng.lng
        );
      });
  }
}
export default Confirmation;
