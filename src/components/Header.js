import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";

class Header extends Component {
    render() {
        return (
            <header className="App-header">
                <div className="logo" />
                <Menu className="Menu" mode="horizontal" style={{ float: "" }}>
                    <Menu.Item
                        key="About Us"
                        href="./AboutUs"
                        className="aboutus"
                    >
                        <Link to={"/aboutus"}>About Us</Link>
                    </Menu.Item>
                    <Menu.Item key="Service" className="service">
                        <Link to={"/"}>Service</Link>
                    </Menu.Item>
                    <Menu.Item key="Track" className="track">
                        <Link to={"/tracking"}>Track</Link>
                    </Menu.Item>
                </Menu>
            </header>
        );
    }
}
export default Header;
