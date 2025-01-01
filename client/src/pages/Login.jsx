import { Form, Button, Card } from "react-bootstrap";
import Logo from "../assets/movie-mate-logo-2.png";
import "./Card.css";

import { Notify } from "../components/Notify";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { instance } from "../utils/axios";

import { setToken, setCurrentUser } from "../utils/storage";
import { isValidRole } from "../utils/secure";

const Login = () => {
  const navigate = useNavigate();
  const [payload, setPayload] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isVerified, setIsverified] = useState(false);

  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      const { data } = await instance.post("/users/login", payload);
      const { data: userInfo, msg } = data;
      setMessage(msg);
      setToken("token", userInfo?.Token);
      setCurrentUser(userInfo?.id);
      if (localStorage.getItem("redirectUrl")) {
        navigate(localStorage.getItem("redirectUrl"));
      } else {
        const isUserAdmin = isValidRole(["admin"]);
        isUserAdmin ? navigate("/admin") : navigate("/");
      }
    } catch (error) {
      const errorMsg =
        error?.response?.data?.msg || "Something went wrong. Please try again";
      setError(errorMsg);
      errorMsg.includes("verified")
        ? setIsverified(true)
        : setIsverified(false);
    } finally {
      setTimeout(() => {
        setError("");
        setMessage("");
      }, 2500);
    }
  };

  const handleImageError = (e) => {
    e.target.src =
      "https://t3.ftcdn.net/jpg/05/90/75/40/360_F_590754013_CoFRYEcAmLREfB3k8vjzuyStsDbMAnqC.jpg";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Card style={{ width: "25rem" }} className="authCard">
        <div className="text-center">
          <img
            src={Logo}
            className="img-fluid pt-3"
            alt="Movie Mate Logo"
            width="200px"
            onError={(e) => handleImageError(e)}
          />
        </div>
        {error && (
          <div className="mt-3 px-4">
            <Notify message={error} />
            {isVerified && (
              <div className="d-flex justify-content-center">
                <Button
                  onClick={() =>
                    navigate("/verify-email", { state: payload?.email })
                  }
                >
                  Verify Email
                </Button>
              </div>
            )}
          </div>
        )}
        {message && (
          <div className="mt-3">
            <Notify variant="success" message={message} />
          </div>
        )}
        <Card.Body className="p-5">
          <Card.Title className="text-secondary">Login</Card.Title>
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="exampleInputEmail1">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                aria-describedby="emailHelp"
                onChange={(e) =>
                  setPayload((prev) => {
                    return { ...prev, email: e.target.value };
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleInputPassword1">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                onChange={(e) =>
                  setPayload((prev) => {
                    return { ...prev, password: e.target.value };
                  })
                }
                required
              />
            </Form.Group>
            <div className="mb-3 text-start ">
              Don&apos;t have an account?{" "}
              <Link
                className="link text-decoration-none fw-bold text-secondary"
                to="/register"
              >
                Register
              </Link>
            </div>
            <div className="mb-3 text-end">
              <Link
                className="link text-decoration-none fw-bold text-secondary"
                to="/forget-password"
              >
                Forgot Password?
              </Link>
            </div>
            <Button type="submit" className="btn btn-primary text-white">
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
