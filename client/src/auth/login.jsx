import { useState } from "react";
import Layout from "../core/Layout";
import { ToastContainer, toast } from "react-toastify";
import { Redirect } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import { authenticate, isAuth } from "./helper.js";

const Login = ({ history }) => {
  //! states
  const [values, setValues] = useState({
    email: "",
    password: "",
    buttonText: "Login",
  });

  const { email, password, buttonText } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/api/login`,
      data: { email, password },
    })
      .then((response) => {
        console.log("LOGIN SUCCESS ", response);
        //! Save the response (user, token) localstorage/cookie
        authenticate(response, () => {
          setValues({
            ...values,
            email: "",
            password: "",
            buttonText: "Logged In",
          });
          // toast.success(`Hey! ${response.data.user.name}, Welcome Back!`);
          isAuth() && isAuth().role === "admin"
            ? history.push("/admin")
            : history.push("/private");
        });
      })
      .catch((error) => {
        console.log("LOGIN ERROR ", error);
        setValues({ ...values, email: "", password: "", buttonText: "Login" });
        toast.error(error.response.data.error);
      });
  };
  const login = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          type="email"
          className="form-control"
          onChange={handleChange("email")}
          value={email}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          type="password"
          className="form-control"
          onChange={handleChange("password")}
          value={password}
        />
      </div>
      <div className="form-group">
        <button className="btn btn-primary" onClick={clickSubmit}>
          {buttonText}
        </button>
      </div>
    </form>
  );
  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <ToastContainer />
        {isAuth() ? <Redirect to="/" /> : null}
        <h1 className="p-5 text-center">Login</h1>
        {login()}
      </div>
    </Layout>
  );
};

export default Login;
