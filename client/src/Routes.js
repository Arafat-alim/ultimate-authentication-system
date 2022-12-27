import { BrowserRouter, Switch, Route } from "react-router-dom";
import App from "./App";
import Signup from "./auth/Signup";
import Login from "./auth/login";
import Activate from "./auth/Activate";
import Private from "./core/Private";
import PrivateRoute from "./auth/PrivateRoute";
import Admin from "./core/Admin";
import AdminRoutes from "./auth/AdminRoutes";
import Forgot from "./auth/Forgot";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/auth/activate/:token" component={Activate} />
        <PrivateRoute path="/private" component={Private} />
        <AdminRoutes path="/admin" component={Admin} />
        <Route path="/auth/password/forgot" component={Forgot} />
        <Route path="/" component={App} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
