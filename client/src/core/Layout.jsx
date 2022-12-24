import { Link } from "react-router-dom";

const Layout = ({ children }) => {
  const nav = () => {
    return (
      <ul className="nav nav-tabs bg-primary">
        <li className="item">
          <Link href="/" className="text-light nav-link">
            Home
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

export default Layout;
