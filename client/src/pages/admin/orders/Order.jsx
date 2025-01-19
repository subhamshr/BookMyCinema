import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Container, Row, Col, ListGroup, Form, Button } from "react-bootstrap";
import { FaCartPlus } from "react-icons/fa";

import { useSelector, useDispatch } from "react-redux";
import {
  getOneOrder,
  updateOrder,
  changeOrderStatus,
} from "../../../slices/orderSlice";

const Order = () => {
  const dispatch = useDispatch();
  const { order } = useSelector((state) => state.orders);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const orderId = pathname.split("/")[3];

  const [payload, setPayload] = useState({
    name: order?.name || "",
    email: order?.email || "",
    total: order?.total || "",
    type: order?.type || "",
    products: order?.products || [],
  });

  const handleEdit = async (e) => {
    e.preventDefault();
    dispatch(updateOrder({ id: orderId, payload }));
    navigate("/admin/orders");
  };

  useEffect(() => {
    dispatch(getOneOrder(orderId));
  }, [dispatch, orderId]);

  useEffect(() => {
    setPayload({
      name: order?.name || "",
      email: order?.email || "",
      total: order?.total || "",
      type: order?.type || "",
      products: order?.products || [],
    });
  }, [order]);


  return (
    <>
      <Container className="mt-5">
        <h1 className="pb-4">Edit Order</h1>
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
              {order?.products?.length > 0 &&
                order?.products?.map((item, index) => {
                  return (
                    <ListGroup.Item
                      className="d-flex justify-content-between lh-condensed gap-1"
                      key={index}
                    >
                      <div>
                        <img
                          src={item?.movie?.poster}
                          style={{
                            height: "40px",
                            width: "40px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div>
                        <h6 className="my-0">{item?.movie?.title}</h6>
                      </div>
                      <div>
                        <span className="text-primary px-2">*</span>
                        <span className="text-primary">{item?.quantity}</span>
                      </div>
                      <span>${item?.amount}</span>
                    </ListGroup.Item>
                  );
                })}
              <ListGroup.Item className="d-flex justify-content-end gap-5">
                <span>Total</span>
                <strong>${order?.total}</strong>
              </ListGroup.Item>
            </ListGroup>
          </Col>
          {/* {msg && <Notify variant="success" message={msg} />} */}
          <Col md={7} className="order-md-1">
            <h4 className="mb-3">Billing Information</h4>
            <Form className="needs-validation" onSubmit={handleEdit}>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label htmlFor="Name">Full Name</Form.Label>
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
                    Valid first name is required.
                  </Form.Control.Feedback>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label htmlFor="email">Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={payload?.email}
                    onChange={(e) =>
                      setPayload((prev) => {
                        return { ...prev, email: e.target.value };
                      })
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid email address.
                  </Form.Control.Feedback>
                </Col>
              </Row>

              <hr className="mb-4" />

              <h4 className="mb-3">Payment</h4>

              <Form.Group>
                <Form.Select
                  value={payload?.type}
                  onChange={(e) =>
                    setPayload((prev) => {
                      return { ...prev, type: e.target.value };
                    })
                  }
                >
                  <option value="Online">Esewa</option>
                  <option value="Cash On Delivery">Cash On Delivery</option>
                </Form.Select>
              </Form.Group>

              <hr className="mb-4" />

              <h4 className="mb-3">Status</h4>

              <Form.Group>
                <Form.Select
                  value={order?.status}
                  onChange={(e) =>
                    dispatch(
                      changeOrderStatus({
                        id: orderId,
                        payload: { status: e.target.value },
                      })
                    )
                  }
                >
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="failed">Failed</option>
                </Form.Select>
              </Form.Group>

              <hr className="mb-4" />
              <Button variant="primary" size="lg" type="submit">
                Save
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Order;
