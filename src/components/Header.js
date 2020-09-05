import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import image from "../assets/images/ExpressBot.png";
class Header extends Component {
  render() {
    return (
      <header className="App-header">
        <div />
        <Menu className="Menu" mode="horizontal" style={{ float: "" }}>
          <Menu.Item>
            <Link to={"/"}>
              <img src={image} alt="logo" className="logo" />
            </Link>
          </Menu.Item>
          <Menu.Item key="Track" className="track float-to-right">
            <Link to={"/tracking"}>
              <span className="link">Track</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="Service" className="service float-to-right">
            <Link to={"/"}>
              <span className="link">Service</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="About Us" className="aboutus float-to-right">
            <Link to={"/aboutus"}>
              <span className="link">About Us</span>
            </Link>
          </Menu.Item>
        </Menu>
      </header>
    );
  }
}
export default Header;
