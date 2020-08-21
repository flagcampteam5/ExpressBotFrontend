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
      pickUpLocation: this.props.location.state.pickUpLocation,
      destination: this.props.location.state.destination,
    };
  }
  render() {
    if (this.state.orderPlaced === false) {
      return (
        <div>
          <this.renderForm />
          <ul>
            <li>Pick-Up Location: {this.state.pickUpLocation}</li>
            <li>Destination: {this.state.destination}</li>
          </ul>
          <Map />
        </div>
      );
    }
    return (
      <div>
        <this.renderComfirmation />
        <ul>
          <li>Pick-Up Location: {this.state.pickUpLocation}</li>
          <li>Destination: {this.state.destination}</li>
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
