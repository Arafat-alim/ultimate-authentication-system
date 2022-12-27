import Layout from "./Layout";
import { getCookie, isAuth, signout, updateUser } from "../auth/helper";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useState, useEffect } from "react";

const Private = ({ history }) => {
  const [values, setValues] = useState({
    role: "",
    name: "",
    email: "",
    password: "",
    buttonText: "Update",
  });

  const { role, name, email, password, buttonText } = values;

  const token = getCookie("token");

  const loadProfile = () => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/api/user/${isAuth()._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log("PRIVATE PROFILE UPDATE", response.data);
        const { role, name, email } = response.data;
        setValues({ ...values, role, name, email });
      })
      .catch((error) => {
        console.log("Private Profile Update Error", error.response.data.error);
        if (error.response.status === 401) {
          signout(() => {
            history.push("/login");
          });
        }
      });
  };
  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (name) => (e) => {
    setValues({ ...values, [name]: e.target.value });
  };

  const clickSubmit = (e) => {
    e.preventDefault();
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API}/api/user/update`,
      data: { name, password },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log("PRIVATE PROFILE UPDATE SUCCESS", response);
        updateUser(response, () => {
          setValues({ ...values, password: "" });
          toast.success("Profile Updated Successfully");
        });
      })
      .catch((error) => {
        console.log("PRIVATE PROFILE UPDATE ERROR", error.response.data.error);
        toast.error(error.response.data.error);
      });
  };
  const updateForm = () => {
    return (
      <form>
        <div className="form-group">
          <label className="text-muted">Role</label>
          <input
            type="text"
            value={role}
            className="form-control"
            onChange={handleChange("role")}
            disabled
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Name</label>
          <input
            type="text"
            value={name}
            className="form-control"
            onChange={handleChange("name")}
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Email</label>
          <input
            type="email"
            value={email}
            className="form-control"
            onChange={handleChange("email")}
            disabled
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Password</label>
          <input
            type="password"
            value={password}
            className="form-control"
            onChange={handleChange("password")}
          />
        </div>
        <div>
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
        {!isAuth() && window.reload()}
        <ToastContainer />
        <h1 className="pt-5 text-center">Private </h1>
        <p className="lead text-center">Profile Update</p>
        {updateForm()}
      </div>
    </Layout>
  );
};

export default Private;
