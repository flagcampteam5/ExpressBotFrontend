import React, { Component } from "react";
import { Card, Form, Button, Input } from "antd";
import Progress from "../Progress";

class Track extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderNumber: null,
      enteredTrackingNum: false,
      orderTrackingMsg: null,
    };
  }

  handleSubmit = (e) => {
    this.setState({
      enteredTrackingNum: true,
    });
  };

  handleChange = (e) => {
    this.setState({
      orderNumber: e.target.value,
      orderTrackingMsg: "Tracking Order " + this.state.orderNumber,
    });
  };

  render() {
    if (this.state.enteredTrackingNum === false) {
      return (
        <div>
          <Card className="Card" title="Track Your Package">
            <Form id="orderNumber">
              <Form.Item>
                <Input
                  className="Input"
                  placeholder="Enter Tracking Number"
                  type="text"
                  onChange={this.handleChange}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  className="Button"
                  form="orderNumber"
                  type="primary"
                  htmlType="submit"
                  onClick={this.handleSubmit}
                >
                  Track
                </Button>
              </Form.Item>
            </Form>
          </Card>
          <Progress />
        </div>
      );
    } else {
      return (
        <div>
          <Card
            className="TrackCard"
            title={this.state.orderTrackingMsg}
          ></Card>

          <Progress />
        </div>
      );
    }
  }
}
export default Track;
