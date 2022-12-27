import { Link, withRouter } from "react-router-dom";
import { isAuth, signout } from "../auth/helper";

const Layout = ({ children, match, history }) => {
  const isActive = (path) => {
    if (match.path === path) {
      return { color: "#000", backgroundColor: "#fff" };
    } else {
      return { color: "#fff" };
    }
  };
  const nav = () => {
    return (
      <ul className="nav nav-tabs bg-primary">
        <li className="nav-item">
          <Link className="nav-link" to="/" style={isActive("/")}>
            Home
          </Link>
        </li>
        {!isAuth() && (
          <>
            <li className="nav-item">
              <Link
                to="/signup"
                className=" nav-link"
                style={isActive("/signup")}
              >
                Signup
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/login" className="nav-link" style={isActive("/login")}>
                Login
              </Link>
            </li>
          </>
        )}
        {/* For Admin */}
        {isAuth() && isAuth().role === "admin" && (
          <li className="nav-item">
            <Link to="/admin" className="nav-link" style={isActive("/admin")}>
              {`Welcome ${isAuth().name}`}
            </Link>
          </li>
        )}
        {/* For Subscriber */}
        {isAuth() && isAuth().role === "subscriber" && (
          <li className="nav-item">
            <Link
              to="/private"
              style={isActive("/private")}
              className="nav-link"
            >
              {`Welcome ${isAuth().name}`}
            </Link>
          </li>
        )}
        {/* For logout */}
        {isAuth() && (
          <li className="nav-item">
            <span
              className="nav-link"
              style={{
                backgroundColor: "red",
                color: "#fff",
                cursor: "pointer",
              }}
              onClick={() =>
                signout(() => {
                  history.push("/");
                })
              }
            >
              Logout
            </span>
          </li>
        )}
      </ul>
    );
  };

  return (
    <>
      {nav()}
      <div className="container">{children}</div>
    </>
  );
};

export default withRouter(Layout);
