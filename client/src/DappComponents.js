import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import history from "./history";
import Navbar from "./Components/Navbar";
import Menu from "./Menu";
import Regiscert from "./Regiscert";
import Validate from "./Validate";

function DappComponents() {
  useEffect(() => {
    history.listen(() => {
      console.log("wow");
    });
  }, []);

  return (
    <div className="App">
      <Router history={history}>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Menu} />
          <Route path="/regist" component={Regiscert} />
          <Route path="/validate" component={Validate} />
        </Switch>
      </Router>
    </div>
  );
}

export default DappComponents;
