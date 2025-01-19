import { Navbar, Nav, Dropdown } from "react-bootstrap";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { getToken, removeToken } from "../utils/storage";

import { FaUserCircle } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { GiTheater } from "react-icons/gi";
import { IoIosListBox } from "react-icons/io";
import { IoHome, IoSettings } from "react-icons/io5";

import Logo from "../assets/movie-mate-logo-2.png";
import LogoOnly from "../assets/movie-mate-logo.png";

const AdminSidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const user = getToken("currentUser")
    ? JSON.parse(getToken("currentUser"))
    : "";

  const isAdmin = user?.roles?.includes("admin") || false;

  const handleSignOut = () => {
    removeToken();
    removeToken("currentUser");
    navigate("/login", { replace: true });
  };

  return (
    <>
      <div
        style={{ minHeight: "100vh", backgroundColor: "rgb(77, 77, 77" }}
        className="d-flex flex-column p-3"
      >
        <Navbar.Brand href="/admin" className=" mb-3">
          <img
            src={Logo}
            className="img-fluid pt-3 d-none d-md-block"
            alt="Movie Mate Logo"
            width="200px"
          />
          <img
            src={LogoOnly}
            className="img-fluid pt-3 d-block d-md-none"
            alt="Movie Mate Logo"
            width="35px"
          />
        </Navbar.Brand>
        <hr />
        <Nav className="nav nav-pills flex-column mb-auto">
          <Nav.Item>
            <Link
              to="/admin"
              className={
                pathname === "/admin"
                  ? "nav-link active d-flex align-items-center"
                  : "nav-link  d-flex align-items-center"
              }
              aria-current="page"
            >
              <IoHome width="32" height="32" className="me-2" />
              <span className="d-none d-md-inline">Home</span>
            </Link>
          </Nav.Item>
          {isAdmin && (
            <>
              <Nav.Item>
                <Link
                  to="/admin/users"
                  className={
                    pathname === "/admin/users"
                      ? "nav-link active d-flex align-items-center"
                      : "nav-link  d-flex align-items-center"
                  }
                >
                  <FaUsers width="32" height="32" className="me-2" />
                  <span className="d-none d-md-inline">Users</span>
                </Link>
              </Nav.Item>
              <Nav.Item>
                <Link
                  to="/admin/movies"
                  className={
                    pathname === "/admin/movies"
                      ? "nav-link active d-flex align-items-center"
                      : "nav-link  d-flex align-items-center"
                  }
                >
                  <GiTheater width="32" height="32" className="me-2" />

                  <span className="d-none d-md-inline">Movies</span>
                </Link>
              </Nav.Item>
              <Nav.Item>
                <Link
                  to="/admin/orders"
                  className={
                    pathname === "/admin/orders"
                      ? "nav-link active d-flex align-items-center"
                      : "nav-link  d-flex align-items-center"
                  }
                >
                  <IoIosListBox width="32" height="32" className="me-2" />

                  <span className="d-none d-md-inline">Orders</span>
                </Link>
              </Nav.Item>
            </>
          )}

          <Nav.Item>
            <Link
              to="/admin/settings"
              className={
                pathname === "/admin/settings" ? "nav-link active" : "nav-link "
              }
            >
              <IoSettings width="32" height="32" className="me-2" />
              <span className="d-none d-md-inline">Settings</span>
            </Link>
          </Nav.Item>
        </Nav>
        <hr />
        <Dropdown>
          <Dropdown.Toggle
            variant="dark"
            id="dropdown-user"
            className="d-flex align-items-center "
          >
            <FaUserCircle
              width="32"
              height="32"
              className="rounded-circle me-2"
            />
            <strong className="d-none d-md-inline">{user.name}</strong>
          </Dropdown.Toggle>
          <Dropdown.Menu variant="dark" className="shadow">
            <Link className="dropdown-item" to="/admin/profile">
              Profile
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </>
  );
};

export default AdminSidebar;
