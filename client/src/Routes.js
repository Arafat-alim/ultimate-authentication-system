import { BrowserRouter, Switch, Route } from "react-router-dom";
import App from "./App";
import Signup from "./auth/Signup";
import Login from "./auth/login";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />

        <Route path="/" component={App} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
