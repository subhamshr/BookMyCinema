import { Nav, Navbar, Form, Container, Button } from "react-bootstrap";
import { FaCartPlus } from "react-icons/fa";
import Logo from "../assets/movie-mate-logo-2.png";
import "./UserNavbar.css";

import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getToken, removeToken } from "../utils/storage";

const UserNavbar = () => {
  const { quantity } = useSelector((state) => state.cart);

  const user = getToken("currentUser")
    ? JSON.parse(getToken("currentUser"))
    : "";

  const navigate = useNavigate();

  const isAdmin = user?.roles?.includes("admin") || false;

  const handleSignOut = () => {
    removeToken();
    removeToken("currentUser");
    navigate("/login", { replace: true });
  };
  return (
    <Navbar expand="lg" className="position-fixed w-100" id="mainNavbar">
      <Container fluid>
        <Navbar.Brand>
          <img src={Logo} height={30} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Link
              to="/"
              style={{ textDecoration: "none", paddingRight: "2rem" }}
            >
              Home
            </Link>

            <Link
              to="/settings"
              style={{ textDecoration: "none", paddingRight: "2rem" }}
            >
              Settings
            </Link>
            {user?.name && (
              <Link to="/profile" style={{ textDecoration: "none" }}>
                Profile
              </Link>
            )}
          </Nav>
          <Form className="d-flex">
            <Link to="/admin">
              {isAdmin && (
                <Button className="mx-3" variant="outline-primary">
                  <span>Admin Panel</span>{" "}
                </Button>
              )}
            </Link>
            <Link to="/cart">
              <Button variant="secondary" className="d-flex align-items-center">
                <FaCartPlus />
                <span className="ps-2 ">({quantity})</span>
              </Button>
            </Link>
            {user?.name ? (
              <Button
                className="mx-3"
                onClick={handleSignOut}
                variant="outline-primary"
              >
                Logout
              </Button>
            ) : (
              <Button
                className="mx-3"
                onClick={() => navigate("/login")}
                variant="outline-primary"
              >
                Login
              </Button>
            )}
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default UserNavbar;
