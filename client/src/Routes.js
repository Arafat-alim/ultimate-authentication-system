import { BrowserRouter, Switch, Route } from "react-router-dom";
import App from "./App";
import Signup from "./auth/Signup";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/signup" component={Signup} />◘
        <Route path="/" component={App} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
