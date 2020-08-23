import React, { Component } from "react";
import { Card, Form, Input, Button } from "antd";
import { Link } from "react-router-dom";
import Map from "../Map";

class Request extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderPlaced: false,
      customerEmail: null,
      pickUpAddress: this.props.location.state.pickUpAddress,
      pickUpLatLng: this.props.location.state.pickUpLatLng,
      destinationAddress: this.props.location.state.destinationAddress,
      destinationLatLng: this.props.location.state.destinationLatLng,
    };
  }
  render() {
    if (this.state.orderPlaced === false) {
      return (
        <div>
          <this.renderForm />
          <ul>
            <li>Pick-Up Location: {this.state.pickUpAddress}</li>
            <li>Destination: {this.state.destinationAddress}</li>
          </ul>
          <Map
            pickUpLatLng={this.state.pickUpLatLng}
            destinationLatLng={this.state.destinationLatLng}
          />
        </div>
      );
    }
    return (
      <div>
        <this.renderComfirmation />
        <ul>
          <li>Pick-Up Location: {this.state.pickUpAddress}</li>
          <li>Destination: {this.state.destinationAddress}</li>
        </ul>
        <Map />
      </div>
    );
  }

  renderForm = () => {
    return (
      <Card title="Request Details">
        <Form>
          <Form.Item
            name="Your Input"
            rules={[
              {
                type: "email",
                required: true,
              },
            ]}
          >
            <Input placeholder="Enter Your Email" />
          </Form.Item>
          <Form.Item>
            <Input
              placeholder="Enter Recipient's Email"
              onChange={this.handleChange}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={this.handleSubmit}>
              Request
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  };
  renderComfirmation = () => {
    return (
      <Card title="Thank You For Your Order!">
        <ul>
          <li>Order Number: 12345ABC</li>
          <li>Estimated Delivery Time: 12:00 PM</li>
          <li>Order total: $10</li>
        </ul>
        <Form>
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
  };

  handleSubmit = () => {
    this.setState({
      orderPlaced: true,
    });
  };

  handleChange = (e) => {
    this.setState({
      customerEmail: e.target.value,
    });
  };
}
export default Request;
