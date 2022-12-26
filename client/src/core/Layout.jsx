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
        <li className="item">
          <Link to="/" className="nav-link" style={isActive("/")}>
            Home
          </Link>
        </li>
        {!isAuth() ? (
          <>
            <li className="item">
              <Link
                to="/signup"
                className=" nav-link"
                style={isActive("/signup")}
              >
                Signup
              </Link>
            </li>
            <li className="item">
              <Link to="/login" className="nav-link" style={isActive("/login")}>
                Login
              </Link>
            </li>
          </>
        ) : (
          <>
            <li className="item">
              <span
                className="nav-link"
                style={{
                  backgroundColor: "green",

                  color: "#fff",
                }}
              >
                {`Welcome ${isAuth().name}`}
              </span>
            </li>
            <li className="item">
              <span
                className="nav-link"
                style={{ cursor: "pointer", color: "#fff" }}
                onClick={() =>
                  signout(() => {
                    history.push("/login");
                  })
                }
              >
                Logout
              </span>
            </li>
          </>
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
