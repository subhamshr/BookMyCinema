import { Card, Button, Form } from "react-bootstrap";
import Logo from "../assets/movie-mate-logo-2.png";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { Notify } from "../components/Notify";

import { instance } from "../utils/axios";

const ForgetPassword = () => {
  const navigate = useNavigate();

  const [payload, setPayload] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });
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
      const { data } = await instance.post("/users/forget-password-token", {
        email: payload?.email,
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

  const handlePasswordChange = async (e) => {
    try {
      e.preventDefault();
      const { data } = await instance.post(
        "/users/forget-password-change",
        payload
      );
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
      }, 2000);
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
            <div className="mt-3 px-4">
              <Notify message={error} />
            </div>
          )}
          {message && (
            <div className="mt-3 px-4">
              <Notify variant="success" message={message} />
            </div>
          )}
          <Card.Body className="p-5">
            <Card.Title>Change Password</Card.Title>
            <Form onSubmit={handlePasswordChange}>
              <Form.Group className="mb-3" controlId="exampleInputEmail1">
                <Form.Label>Enter Email Address</Form.Label>
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
              {otpSent && (
                <>
                  <Form.Group className="mb-3" controlId="exampleInputOTP">
                    <Form.Label>OTP</Form.Label>
                    <Form.Control
                      type="text"
                      minLength="6"
                      maxLength="6"
                      onChange={(e) =>
                        setPayload((prev) => {
                          return { ...prev, otp: e.target.value };
                        })
                      }
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="exampleInputOTP">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      onChange={(e) =>
                        setPayload((prev) => {
                          return { ...prev, newPassword: e.target.value };
                        })
                      }
                      required
                    />
                  </Form.Group>
                </>
              )}
              {otpSent ? (
                <Button type="submit" className="btn btn-primary">
                  Change Password
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

export default ForgetPassword;
