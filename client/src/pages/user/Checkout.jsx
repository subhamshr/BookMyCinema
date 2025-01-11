import { Container, Row, Col, ListGroup, Form, Button } from "react-bootstrap";
import { FaCartPlus } from "react-icons/fa";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Notify, NotifyWithLink } from "../../components/Notify";

import { useSelector, useDispatch } from "react-redux";
import { getToken } from "../../utils/storage";

import OrderServices from "../../services/orders";
import { removeAll } from "../../slices/cartSlice";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);

  const userInfo = JSON.parse(localStorage.getItem("currentUser"));

  const [payload, setPayload] = useState({
    type: "",
    firstName: userInfo?.name.split(" ")[0] || "",
    lastName: userInfo?.name.split(" ")[1] || "",
    email: userInfo?.email || "",
  });

  const [msg, setMsg] = useState("");

  const totalAmount = () =>
    cart.reduce((acc, obj) => acc + obj.quantity * obj.price, 0);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const { firstName, lastName, ...rest } = payload;
      rest.name = userInfo?.name || firstName.concat(" ", lastName);
      rest.products = cart.map((item) => {
        return {
          quantity: item?.quantity,
          price: item?.price,
          amount: item?.price * item?.quantity,
          movie: item?._id,
        };
      });
      rest.buyer = JSON.parse(getToken("currentUser"))?.id || "";
      rest.total = totalAmount();
      const { data } = await OrderServices.create(rest);
      setMsg(data?.msg);
      dispatch(removeAll());
      setTimeout(() => {
        setMsg("");
        navigate("/");
      }, 2500);
    } catch (e) {
      setMsg("Something went again. Please try again in a moment.");
    }
  };

  useEffect(() => {
    if (userInfo?.id) {
      localStorage.removeItem("redirectUrl");
    }
  }, [userInfo?.id]);
  return (
    <>
      <Container className="mt-5">
        {!localStorage.getItem("token") && !userInfo && (
          <NotifyWithLink
            message={"Please Login to buy the tickets"}
            link="/checkout"
            forward="/login"
          />
        )}
        <Row>
          <Col md={5} className="order-md-2 mb-4">
            <h4 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted">
                Your cart{" "}
                <span className="text-secondary">
                  <FaCartPlus />
                </span>
              </span>
            </h4>
            <ListGroup className="mb-3">
              {cart?.length > 0 &&
                cart?.map((item, index) => {
                  return (
                    <ListGroup.Item
                      className="d-flex justify-content-between lh-condensed gap-1"
                      key={index}
                    >
                      <div>
                        <img
                          src={item?.poster}
                          style={{
                            height: "40px",
                            width: "40px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div>
                        <h6 className="my-0">{item?.title}</h6>
                        <small className="text-muted">
                          {item?.synopsis.slice(0, 30).concat("...")}
                        </small>
                      </div>
                      <span className="text-muted">{item?.quantity}</span>
                      <span>
                        ${(item?.price * item?.quantity).toLocaleString()}
                      </span>
                    </ListGroup.Item>
                  );
                })}
              <ListGroup.Item className="d-flex justify-content-end gap-5">
                <span>Total</span>
                <strong>${totalAmount().toLocaleString()}</strong>
              </ListGroup.Item>
            </ListGroup>
          </Col>
          {msg && <Notify variant="success" message={msg} />}
          <Col md={7} className="order-md-1">
            <h4 className="mb-3">Billing Information</h4>
            <Form className="needs-validation" onSubmit={handleFormSubmit}>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label htmlFor="firstName">First name</Form.Label>
                  <Form.Control
                    type="text"
                    id="firstName"
                    placeholder={userInfo && userInfo?.name.split(" ")[0]}
                    onChange={(e) =>
                      setPayload((prev) => {
                        return { ...prev, firstName: e.target.value };
                      })
                    }
                    required
                    disabled={userInfo}
                  />
                  <Form.Control.Feedback type="invalid">
                    Valid first name is required.
                  </Form.Control.Feedback>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label htmlFor="lastName">Last name</Form.Label>
                  <Form.Control
                    type="text"
                    id="lastName"
                    placeholder={userInfo && userInfo?.name.split(" ")[1]}
                    onChange={(e) =>
                      setPayload((prev) => {
                        return { ...prev, lastName: e.target.value };
                      })
                    }
                    disabled={userInfo}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Valid last name is required.
                  </Form.Control.Feedback>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="email">Email</Form.Label>
                <Form.Control
                  type="email"
                  id="email"
                  placeholder={userInfo?.email}
                  disabled={userInfo}
                  onChange={(e) =>
                    setPayload((prev) => {
                      return { ...prev, email: e.target.value };
                    })
                  }
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a valid email address.
                </Form.Control.Feedback>
              </Form.Group>

              <hr className="mb-4" />

              <h4 className="mb-3">Payment</h4>

              <Form.Group>
                <Form.Check
                  type="radio"
                  label="Esewa"
                  value="Online"
                  name="paymentMethod"
                  onChange={(e) =>
                    setPayload((prev) => {
                      return { ...prev, type: e.target.value };
                    })
                  }
                  required
                />
                <Form.Check
                  type="radio"
                  label="Cash On Delivery"
                  value="Cash On Delivery"
                  name="paymentMethod"
                  onChange={(e) =>
                    setPayload((prev) => {
                      return { ...prev, type: e.target.value };
                    })
                  }
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please select a payment method.
                </Form.Control.Feedback>
              </Form.Group>

              <hr className="mb-4" />
              <Button
                variant="primary"
                size="lg"
                type="submit"
                disabled={!userInfo}
              >
                Continue to checkout
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Checkout;
