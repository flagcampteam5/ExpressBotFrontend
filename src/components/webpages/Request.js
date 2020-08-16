import React, { Component } from "react";
import { Card, Form, Input, Button } from "antd";
import { Link } from "react-router-dom";
import Map from "../Map";

class Request extends Component {
  constructor() {
    super();
    this.state = {
      orderPlaced: false,
      customerEmail: null,
    };
  }

  render() {
    if (this.state.orderPlaced === false) {
      return (
        <div>
          <this.renderForm />
          <Map />
        </div>
      );
    }
    return (
      <div>
        <this.renderComfirmation />
        <Map />
      </div>
    );
  }

  renderForm = () => {
    return (
      <Card title="Request Details">
        <Form>
          <Form.Item
            name="Input email"
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
