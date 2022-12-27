import { useState, useEffect } from "react";
import Layout from "./Layout";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { getCookie, isAuth, signout, updateUser } from "../auth/helper";

const Admin = ({ history }) => {
  const [values, setValues] = useState({
    role: "",
    name: "",
    email: "",
    password: "",
    buttonText: "Update",
  });

  const { role, name, email, password, buttonText } = values;
  const handleChange = (name) => (e) => {
    setValues({ ...values, [name]: e.target.value });
  };

  const clickSubmit = (e) => {
    e.preventDefault();
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API}/api/admin/update`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { name, password },
    })
      .then((response) => {
        console.log("UPDATE ADMIN PROFILE SUCCESS", response);
        updateUser(response, () => {
          setValues({ ...values, password: "" });
          toast.success("Profile Updated Successfully!");
        });
      })
      .catch((error) => {
        console.log("UPDATE ADMIN PROFILE FAILED", error.response.data.error);
        toast.error(error.response.data.error);
      });
  };

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
        console.log("ADMIN DATA FETCH SUCCESS", response.data);
        const { role, name, email } = response.data;
        setValues({ ...values, role, name, email });
      })
      .catch((error) => {
        console.log("ADMIN DATA FETCHING FAILED", error.response.data.error);
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

  const updateForm = () => {
    return (
      <form>
        <div className="form-group">
          <label className="text-muted">Role</label>
          <input
            type="text"
            className="form-control"
            value={role}
            onChange={handleChange("role")}
            disabled
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Name</label>
          <input
            className="form-control"
            type="text"
            value={name}
            onChange={handleChange("name")}
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Email</label>
          <input
            className="form-control"
            type="email"
            value={email}
            onChange={handleChange("email")}
            disabled
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Password</label>
          <input
            className="form-control"
            type="password"
            value={password}
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
        <ToastContainer />
        <h1 className="pt-5 text-center">Admin</h1>
        <p className="lead text-center">Profile Update</p>
        {updateForm()}
      </div>
    </Layout>
  );
};

export default Admin;
