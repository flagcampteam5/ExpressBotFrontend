import React, { Component } from "react";
import Header from "./Header";
import { Switch, Route } from "react-router-dom";
import Service from "./webpages/Service";
import AboutUs from "./webpages/AboutUs";
import Track from "./webpages/Track";
import Request from "./webpages/Request";
import Confirmation from "./webpages/Confirmation";
class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Switch>
          <Route exact path="/" component={Service} />
          <Route path="/aboutus" component={AboutUs} />
          <Route path="/tracking" component={Track} />
          <Route path="/request" component={Request} />
          <Route path="/confirmation" component={Confirmation} />
        </Switch>
      </div>
    );
  }
}

export default App;
