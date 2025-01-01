import { Form, Button, Card } from "react-bootstrap";
import Logo from "../assets/movie-mate-logo-2.png";

import { Notify } from "../components/Notify";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { instance } from "../utils/axios";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [otpSent, setOtpsent] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const handleImageError = (e) => {
    e.target.src =
      "https://t3.ftcdn.net/jpg/05/90/75/40/360_F_590754013_CoFRYEcAmLREfB3k8vjzuyStsDbMAnqC.jpg";
  };

  const sendOTP = async (e) => {
    try {
      e.preventDefault();
      const { data } = await instance.post("/users/generate-email-token", {
        email,
      });
      setMessage(data?.msg);
      setOtpsent(true);
    } catch (error) {
      const errorMsg =
        error?.response?.data?.msg || "Something went wrong. Please try again";
      setError(errorMsg);
    } finally {
      setTimeout(() => {
        setError("");
        setMessage("");
      }, 2500);
    }
  };

  const handleEmailVerification = async (e) => {
    try {
      e.preventDefault();
      const { data } = await instance.post("/users/verify-email", {
        email,
        otp,
      });
      setMessage(data?.msg);
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (error) {
      const errorMsg =
        error?.response?.data?.msg || "Something went wrong. Please try again";
      setError(errorMsg);
    } finally {
      setTimeout(() => {
        setError("");
        setMessage("");
      }, 5000);
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
          {error && (
            <div className="mt-3 p-2">
              <Notify message={error} />
            </div>
          )}
          {message && (
            <div className="mt-3 px-4">
              <Notify variant="success" message={message} />
            </div>
          )}
          <Card.Body className="p-5">
            <Card.Title>Veirfy Email</Card.Title>
            <Form onSubmit={handleEmailVerification}>
              <Form.Group className="mb-3" controlId="exampleInputEmail1">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  aria-describedby="emailHelp"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              {otpSent && (
                <Form.Group className="mb-3" controlId="exampleInputOTP">
                  <Form.Label>OTP</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </Form.Group>
              )}
              {otpSent ? (
                <Button type="submit" className="btn btn-primary">
                  Verify Email
                </Button>
              ) : (
                <Button onClick={sendOTP} className="btn btn-primary">
                  Send OTP
                </Button>
              )}
            </Form>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default VerifyEmail;
