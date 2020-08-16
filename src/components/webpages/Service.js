import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import { Card, Input, Form, Button } from "antd";
import image from "../../assets/images/RobotDelivery.jpeg";
import background from "../../assets/images/SF.jpg";

class Service extends Component {
  constructor() {
    super();
    this.state = {
      redirect: false,
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
                <Input placeholder="Enter Your Pick-Up Location" />
              </Form.Item>
              <Form.Item>
                <Input placeholder="Enter Your Destination" />
              </Form.Item>
              <Form.Item>
                <Button className="Button" type="primary">
                  <Link to={"/request"}>Request</Link>
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    );
  }
}
export default Service;
