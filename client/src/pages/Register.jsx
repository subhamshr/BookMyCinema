import { Row, Card, Button, Form } from "react-bootstrap";
import Logo from "../assets/movie-mate-logo-2.png";

import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Notify } from "../components/Notify";

import { instance } from "../utils/axios";

const Register = () => {
  const navigate = useNavigate();
  const registerRef = useRef();

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const handleImageError = (e) => {
    e.target.src =
      "https://t3.ftcdn.net/jpg/05/90/75/40/360_F_590754013_CoFRYEcAmLREfB3k8vjzuyStsDbMAnqC.jpg";
  };
  const handleRegister = async (e) => {
    try {
      e.preventDefault();
      const form = registerRef.current;
      const payload = new FormData(form);
      const { data } = await instance.post("/users/register", payload);
      setMessage(data?.msg);
      setTimeout(() => {
        navigate("/verify-email", { replace: true });
      }, 1500);
    } catch (error) {
      const errorMsg =
        error?.response?.data?.msg || "Something went wrong. Please try again";
      setError(errorMsg);
    } finally {
      setTimeout(() => {
        setError("");
        setMessage("");
      }, 3000);
    }
  };
  return (
    <>
      {" "}
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
          {error && <Notify message={error} />}
          {message && <Notify variant="success" message={message} />}

          <Card.Body className="p-5">
            <Card.Title className="text-secondary">Register</Card.Title>
            <Form onSubmit={handleRegister} ref={registerRef}>
              <Row className="mb-3">
                <Form.Group className="mb-3" controlId="exampleInputName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    aria-describedby="name"
                    name="name"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleInputEmail1">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    aria-describedby="emailHelp"
                    name="email"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleInputPassword1">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" name="password" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleInputFile">
                  <Form.Label>Profile Picture</Form.Label>
                  <Form.Control type="file" name="file" />
                </Form.Group>
              </Row>
              <div className="mb-3 text-start">
                Already have an account?{" "}
                <Link className="link text-decoration-none fw-bold" to="/login">
                  Login
                </Link>
              </div>
              <Button type="submit" className="btn btn-primary">
                Register
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default Register;
