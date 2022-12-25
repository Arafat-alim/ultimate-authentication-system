import { BrowserRouter, Switch, Route } from "react-router-dom";
import App from "./App";
import Signup from "./auth/Signup";
import Login from "./auth/login";
import Activate from "./auth/Activate";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/auth/activate/:token" component={Activate} />
        <Route path="/" component={App} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
