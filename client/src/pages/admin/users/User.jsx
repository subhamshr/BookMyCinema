import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Container, Row, Col, Form, Button } from "react-bootstrap";

import { useSelector, useDispatch } from "react-redux";
import {
  getOneUser,
  updateUserByAdmin,
  blockUserByAdmin,
  resetUserPassword,
} from "../../../slices/userSlice";


const User = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const userId = pathname.split("/")[3];

  const [payload, setPayload] = useState({
    name: user?.name || "",
    email: user?.email || "",
    roles: user?.roles || [],
    isActive: user?.isActive || false,
    isEmailVerified: user?.isEmailVerified || false,
  });
  const [newPassword, setNewPassword] = useState("");

  const handleEdit = async (e) => {
    e.preventDefault();
    dispatch(updateUserByAdmin({ id: userId, payload }));
    navigate("/admin/users");
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    dispatch(
      resetUserPassword({
        id: userId,
        newPassword,
      })
    );
  };

  useEffect(() => {
    dispatch(getOneUser(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    setPayload({
      name: user?.name || "",
      email: user?.email || "",
      roles: user?.roles || [],
      isActive: user?.isActive || false,
      isEmailVerified: user?.isEmailVerified || false,
    });
  }, [user]);

  return (
    <>
      <Container className="mt-5">
        <h1 className="pb-4">Edit User</h1>
        <Row>
          <Col md={12} className="user-md-1">
            <h4 className="mb-3">User Information</h4>
            <Form className="needs-validation" onSubmit={handleEdit}>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label htmlFor="name">Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={payload?.name}
                    onChange={(e) =>
                      setPayload((prev) => {
                        return { ...prev, name: e.target.value };
                      })
                    }
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Valid name is required.
                  </Form.Control.Feedback>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label htmlFor="email">Email</Form.Label>
                  <Form.Control
                    type="text"
                    value={payload?.email}
                    onChange={(e) =>
                      setPayload((prev) => {
                        return { ...prev, email: e.target.value };
                      })
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid email.
                  </Form.Control.Feedback>
                </Col>
              </Row>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label htmlFor="roles">
                    Current Roles : {payload?.roles.join(", ")}
                  </Form.Label>
                  {!payload?.roles?.includes("admin") ? (
                    <Button
                      className="btn-secondary btn-sm mx-2"
                      onClick={() =>
                        setPayload((prev) => ({
                          ...prev,
                          roles: [...prev.roles, "admin"],
                        }))
                      }
                    >
                      Add User as Admin
                    </Button>
                  ) : (
                    <Button
                      className="btn-secondary btn-sm mx-2"
                      onClick={() =>
                        setPayload((prev) => ({
                          ...prev,
                          roles: prev.roles.includes("admin")
                            ? prev.roles.filter((role) => role !== "admin")
                            : [...prev.roles, "admin"],
                        }))
                      }
                    >
                      Remove User as Admin
                    </Button>
                  )}

                  <Form.Control.Feedback type="invalid">
                    Valid roles is required.
                  </Form.Control.Feedback>
                </Col>
              </Row>
              <hr className="mb-4" />
              <Row className="mt-4">
                <Form.Group>
                  <Form.Check
                    type="switch"
                    label="Is User Active?"
                    checked={payload?.isActive}
                    onChange={(e) => {
                      setPayload((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }));
                      dispatch(
                        blockUserByAdmin({
                          id: userId,
                        })
                      );
                    }}
                  />
                </Form.Group>
              </Row>

              <hr className="mb-4" />
              <Row className="mt-4">
                <Form.Group>
                  <Form.Check
                    type="switch"
                    label="Is User Email Verified?"
                    checked={payload?.isEmailVerified}
                    onChange={(e) =>
                      setPayload((prev) => ({
                        ...prev,
                        isEmailVerified: e.target.checked,
                      }))
                    }
                  />
                </Form.Group>
              </Row>

              <Button
                className="mt-4"
                variant="primary"
                size="lg"
                type="submit"
              >
                Save User Details
              </Button>
            </Form>
          </Col>
        </Row>
        <hr className="mb-4" />
        <Row className="mt-4">
          <Col md={3}>
            <Form onSubmit={handleResetPassword}>
              <Form.Label htmlFor="password">Reset Password</Form.Label>
              <Form.Group>
                <Form.Control 
                  type="text"
                  defaultValue="enter new password"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Button variant="secondary" className="mt-3" type="submit">
                  Reest Password
                </Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default User;
