import Layout from "../core/Layout";
import { isAuth } from "./helper";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";

const Reset = ({ match, history }) => {
  const [values, setValues] = useState({
    name: "",
    token: "",
    newPassword: "",
    buttonText: "Submit",
  });
  const handleChange = (name) => (e) => {
    setValues({ ...values, [name]: e.target.value });
  };

  useEffect(() => {
    let token = match.params.token; //! using the react-router dom
    let { name } = jwt_decode(token);
    setValues({ ...values, name, token });
  }, []);

  const { name, token, newPassword, buttonText } = values;
  //   let resetPasswordLink = match.params.token;

  const clickSubmit = (e) => {
    e.preventDefault();
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API}/api/reset-password`,
      data: { newPassword, resetPasswordLink: token },
    })
      .then((response) => {
        console.log("RESET PASSWORD SUCCESS", response.data);
        setValues({ ...values, newPassword: "" });
        toast.success(response.data);
      })
      .catch((err) => {
        console.log("RESET PASSWORD FAILED", err.response.data.error);
        setValues({ ...values, newPassword: "" });
        toast.error(err.response.data.error);
        if (err.response.status === 400) {
          toast.error("Redirecting to the Login Page");
          setTimeout(() => {
            history.push("/login");
          }, 5000);
        }
      });
  };

  const resetForm = () => {
    return (
      <form>
        <div className="form-group">
          <label className="text-muted">Enter a New Password</label>
          <input
            className="form-control"
            type="password"
            value={newPassword}
            onChange={handleChange("newPassword")}
            required
          />
        </div>
        <div className="form-group">
          <button className="btn btn-primary" onClick={clickSubmit}>
            {buttonText}
          </button>
        </div>
      </form>
    );
  };

  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        {isAuth() && history.push("/")}
        <ToastContainer />
        <h3 className="p-5 text-center">{`Hey ${name}! Type your New password `}</h3>
        {resetForm()}
      </div>
    </Layout>
  );
};

export default Reset;
