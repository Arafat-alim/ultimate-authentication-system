import { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import Layout from "../core/Layout";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  //! state
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    buttonText: "Submit",
  });

  //! Destructuring
  const { name, email, password, buttonText } = values;

  //! Handle change
  const handleChange = (name) => (event) => {};

  //! Click Submit
  const clickSubmit = (event) => {
    event.preventDefault();
  };

  const signup = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          type="text"
          className="form-control"
          onChange={handleChange("name")}
          value={name}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Email ID</label>
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
        <h1 className="p-5 text-center">Signup</h1>
        {signup()}
      </div>
    </Layout>
  );
};

export default Signup;
