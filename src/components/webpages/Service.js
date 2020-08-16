import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import { Card, Input, Form, Button } from "antd";

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
                    <div className="introduction">
                        <span>Introduction to our web</span>
                    </div>
                    <div className="picture">
                        <img src="../../asset/images/RobotDelivery.jpeg"></img>
                    </div>
                </div>
                <div className="form-div">
                    <Form className="form">
                        <Form.Item>
                            <div>
                                <span className="span">Request pick-up</span>
                            </div>
                        </Form.Item>
                        <Form.Item>
                            <Input
                                className="input"
                                placeholder="Enter Your Pick-Up Location"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Input
                                className="input"
                                placeholder="Enter Your Destination"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button className="button">
                                <Link to={"/request"}>Request</Link>
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        );
    }
}
export default Service;
