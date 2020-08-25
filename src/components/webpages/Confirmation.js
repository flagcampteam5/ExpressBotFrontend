import React, { Component } from "react";
import { Card, Form, Button } from "antd";
import { Link } from "react-router-dom";

class Confirmation extends Component {
  render() {
    return (
      <Card title="Thank You For Your Order!">
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
            <Button type="primary">
              <Link to="/tracking">Track Order</Link>
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary">
              <Link to="/">Place Another Order</Link>
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
}
export default Confirmation;
