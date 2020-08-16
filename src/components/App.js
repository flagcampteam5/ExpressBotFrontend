import React from "react";
import Header from "./Header";
import { Switch, Route } from "react-router-dom";
import Service from "./webpages/Service";
import AboutUs from "./webpages/AboutUs";
import Track from "./webpages/Track";
import Request from "./webpages/Request";

function App() {
  return (
    <div className="App">
      <Header />
      <Switch>
        <Route exact path="/" component={Service} />
        <Route path="/aboutus" component={AboutUs} />
        <Route path="/tracking" component={Track} />
        <Route path="/request" component={Request} />
      </Switch>
    </div>
  );
}

export default App;
