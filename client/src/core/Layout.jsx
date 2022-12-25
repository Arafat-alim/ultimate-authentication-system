import { Link, withRouter } from "react-router-dom";

const Layout = ({ children, match }) => {
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
        <li className="item">
          <Link to="/signup" className=" nav-link" style={isActive("/signup")}>
            Signup
          </Link>
        </li>
        <li className="item">
          <Link to="/login" className="nav-link" style={isActive("/login")}>
            Login
          </Link>
        </li>
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
