import axios from "axios";

import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

import jwt_decode from "jwt-decode";

import "react-toastify/dist/ReactToastify.css";
import Layout from "../core/Layout";

const Activate = ({ match, history }) => {
  //! State
  const [values, setValues] = useState({
    name: "",
    token: "",
    show: true,
  });

  //! Useeffect hook to fetch the token from the url and update the state
  useEffect(() => {
    console.log("HEY MAN I am back");
    let token = match.params.token;
    let { name } = jwt_decode(token);

    if (token) {
      setValues({ ...values, name, token });
    }
  }, []);

  const { name, token, show } = values;
  const clickSubmit = (e) => {
    e.preventDefault();
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/api/account-activation`,
      data: { token },
    })
      .then((response) => {
        console.log("ACTIVATION ACCOUNT SUCCESS", response);
        setValues({ ...values, show: false });
        toast.success(response.data.message);
        toast.success("Redirecting to Login Page...");
        setTimeout(() => {
          history.push("/login");
        }, 10000);
      })
      .catch((error) => {
        console.log("ACTIVATION ACCOUNT FAILED: ", error);
        toast.error(error.response.data.error);
      });
  };

  const activateLink = () => (
    <div className="text-center">
      <h1 className="p-5">{`Hey! ${name} Ready to Activate Your Account?`}</h1>
      <button className="btn btn-outline-primary" onClick={clickSubmit}>
        Activate Account
      </button>
    </div>
  );

  return (
    <Layout>
      <div className="col-md-5 offset-md-3">
        <ToastContainer />
        {activateLink()}
      </div>
    </Layout>
  );
};

export default Activate;
