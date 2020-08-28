import React, { Component } from "react";
import { Card, Form, Input, Button, Select, Radio, Popover } from "antd";
import uuid from "react-uuid";
import Map from "../Map";
import Confirmation from "./Confirmation";

class Request extends Component {
  constructor(props) {
    super(props);
    this.Map = React.createRef();
    this.handleCustomerEmail = this.handleCustomerEmail.bind(this);
    this.handleRecipientEmail = this.handleRecipientEmail.bind(this);
    this.handleWeight = this.handleWeight.bind(this);
    this.handleDimension = this.handleDimension.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      orderPlaced: false,
      customerEmail: null,
      recipientEmail: null,
      pickUpAddress: this.props.location.state.pickUpAddress,
      pickUpLatLng: this.props.location.state.pickUpLatLng,
      destinationAddress: this.props.location.state.destinationAddress,
      destinationLatLng: this.props.location.state.destinationLatLng,
      weight: null,
      dimension: null,
      orderTime: { date: null, hour: null, minute: null },
      estimatedDeliveryTime: { date: null, hour: null, minute: null },
      typeOfRobot: "Drone",
      orderId: null,
    };
  }
  render() {
    if (this.state.orderPlaced === false) {
      return (
        <div>
          <this.renderForm />
          {this.renderMap()}
        </div>
      );
    }
    return (
      <div>
        <Confirmation
          orderId={this.state.orderId}
          customerEmail={this.state.customerEmail}
          pickUpAddress={this.state.pickUpAddress}
          destinationAddress={this.state.destinationAddress}
          estimatedDeliveryTime={this.state.estimatedDeliveryTime}
        />
        {this.renderMap()}
      </div>
    );
  }

  renderForm = () => {
    const { Option } = Select;
    const weights = [
      { text: "< 5lbs", value: 5 },
      { text: "< 10lbs", value: 10 },
      { text: "< 20lbs", value: 20 },
      { text: "< 30lbs", value: 30 },
      { text: "< 50lbs", value: 50 },
    ];
    const dimensions = [
      { text: "< 5 inches X 5 inches", value: 5 },
      { text: "< 10 inches X 10 inches", value: 10 },
      { text: "< 20 inches X 20 inches", value: 20 },
      { text: "< 30 inches X 30 inches", value: 30 },
      { text: "< 40 inches X 40 inches", value: 40 },
    ];
    const droneInfo = {
      text:
        "Drones are designed to carry light-weight, small packages. They fly in a straight line from the pick-up location to the destination. They are faster than road bots but cost more per minute.",
      speed: 0.7,
      price: 1,
    };
    const roadBotInfo = {
      text:
        "Road bots can carry heavier and larger packages than drones. They are slower than drones but cost less per minute.",
      speed: 0.1,
      price: 0.5,
    };
    return (
      <Card className="Card" title="Request Details">
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
            <Input
              className="Input"
              placeholder="Enter Your Email"
              onChange={this.handleCustomerEmail}
            />
          </Form.Item>
          <Form.Item>
            <Input
              className="Input"
              placeholder="Enter Recipient's Email"
              onChange={this.handleRecipientEmail}
            />
          </Form.Item>
          <Form.Item
            style={{ display: "inline-block", width: "calc(50% - 8px)" }}
          >
            <Select
              className="Select"
              defaultValue="Weight of Package"
              onChange={this.handleWeight}
            >
              {weights.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.text}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            style={{
              display: "inline-block",
              width: "calc(50% - 8px)",
              margin: "0 8px",
            }}
          >
            {
              <Select
                className="Select"
                defaultValue="Dimension of Package"
                onChange={this.handleDimension}
              >
                {dimensions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.text}
                  </Option>
                ))}
              </Select>
            }
          </Form.Item>
          <Form.Item>
            {this.state.weight !== null && this.state.dimension !== null ? (
              <Radio.Group
                className="Radio"
                defaultValue={this.state.typeOfRobot}
                buttonStyle="solid"
                onChange={this.handleRobotSelect}
              >
                <Popover content={droneInfo.text} placement="topLeft">
                  <Radio.Button
                    value="Drone"
                    disabled={
                      this.state.weight > 20 || this.state.dimension > 20
                    }
                  >
                    Drone
                  </Radio.Button>
                </Popover>
                <Popover content={roadBotInfo.text} placement="topLeft">
                  <Radio.Button value="RoadBot">Road Bot</Radio.Button>
                </Popover>
              </Radio.Group>
            ) : null}
          </Form.Item>
          <Form.Item>
            <Button
              className="Button"
              type="primary"
              onClick={this.handleSubmit}
            >
              Confirm
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  };

  renderMap = () => {
    return (
      <div className="MapContainer">
        <Map
          pickUpLatLng={this.state.pickUpLatLng}
          destinationLatLng={this.state.destinationLatLng}
          ref={this.Map}
        />
      </div>
    );
  };
  handleSubmit = () => {
    var time = new Date();
    //need to find a way to estimate delivery time. It's hard-coded for now
    var deliveryTime = new Date(time.getTime() + 20 * 60000);
    this.setState({
      orderTime: {
        date: time.getDay(),
        hour: time.getHours(),
        minute: time.getMinutes(),
      },
      estimatedDeliveryTime: {
        date: deliveryTime.getDay(),
        hour: deliveryTime.getHours(),
        minute: deliveryTime.getMinutes(),
      },
      orderId: uuid(),
      orderPlaced: true,
    });
  };

  handleCustomerEmail = (e) => {
    this.setState({
      customerEmail: e.target.value,
    });
  };
  handleRecipientEmail = (e) => {
    this.setState({
      recipientEmail: e.target.value,
    });
  };

  handleWeight = (value) => {
    this.setState({
      weight: value,
    });
    if (value > 20 && this.state.dimension !== null) {
      this.setState({
        typeOfRobot: "RoadBot",
      });
      this.Map.current.renderRoadbotRoute();
    } else if (
      value <= 20 &&
      this.state.dimension !== null &&
      this.state.dimension <= 20
    ) {
      this.setState({
        typeOfRobot: "Drone",
      });
      this.Map.current.renderDroneRoute();
    }
  };
  handleDimension = (value) => {
    this.setState({
      dimension: value,
    });
    if (value > 20 && this.state.weight !== null) {
      this.setState({
        typeOfRobot: "RoadBot",
      });
      this.Map.current.renderRoadbotRoute();
    } else if (
      value <= 20 &&
      this.state.weight !== null &&
      this.state.weight <= 20
    ) {
      this.setState({
        typeOfRobot: "Drone",
      });
      this.Map.current.renderDroneRoute();
    }
  };
  handleRobotSelect = (e) => {
    this.setState({
      typeOfRobot: e.target.value,
    });
    console.log(e.target.value);
    if (e.target.value === "Drone") {
      this.Map.current.renderDroneRoute();
    } else {
      this.Map.current.renderRoadbotRoute();
    }
  };
}
export default Request;
