const Layout = ({ children }) => {
  const nav = () => {
    return (
      <ul className="nav nav-tabs bg-primary">
        <li className="item">
          <a href="/" className="text-light nav-link">
            Home
          </a>
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
