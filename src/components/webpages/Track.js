import React, { Component } from "react";
import { Card, Form, Button, Input, Progress } from "antd";
import { status } from "../../assets/facts";
import BotTracker from "../BotTracker";

class Track extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderNumber: this.props.location.state
        ? this.props.location.state.orderId
        : null,
      enteredTrackingNum: this.props.location.state
        ? this.props.location.state.orderId !== null
        : false,
      status: status[0],
      percent: 0,
    };
    this.onProgressChange = this.onProgressChange.bind(this);
  }

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
                  onPaste={this.handlePaste}
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
          <BotTracker />
        </div>
      );
    } else {
      return (
        <div>
          <Card
            className="Card"
            title={"Tracking Order: " + this.state.orderNumber}
          >
            <div>
              <Progress
                className="ProgressBar"
                style={{ width: 190 }}
                strokeColor={{
                  "40%": "#fcc438",
                  "100%": "#87d068",
                }}
                percent={this.state.percent}
                status={this.state.percent < 100 ? "active" : "success"}
                size="small"
                format={(percent) =>
                  percent === 0 ? "order placed" : this.state.status
                }
              />
            </div>
          </Card>

          <BotTracker
            orderId={this.state.orderNumber}
            onProgressChange={this.onProgressChange}
          />
        </div>
      );
    }
  }

  handleSubmit = (e) => {
    this.setState({
      enteredTrackingNum: true,
    });
  };

  handleChange = (e) => {
    this.setState({
      orderNumber: e.target.value,
    });
  };
  handlePaste = (e) => {
    this.setState({
      orderNumber: e.clipboardData.getData("Text"),
    });
  };
  onProgressChange = (status_id, status) => {
    let percentage = (100.0 / 19) * status_id;
    this.setState({
      status: status,
      percent: percentage,
    });
  };
}
export default Track;
