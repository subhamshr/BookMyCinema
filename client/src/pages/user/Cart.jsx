import { Container, Button, Table, Card } from "react-bootstrap";
import { RiDeleteBin6Line } from "react-icons/ri";
import "../Card.css";

import { Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import {
  removeItem,
  increaseQuantity,
  decreaseQuantity,
  removeAll,
} from "../../slices/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const { cart, quantity } = useSelector((state) => state.cart);
  const totalAmount = () =>
    cart.reduce((acc, obj) => acc + obj.quantity * obj.price, 0);

  return (
    <>
      <div className="d-flex justify-content-center align-items-center flex-column gap-2">
        {cart?.length > 0 ? (
          <FullCart
            cart={cart}
            quantity={quantity}
            increaseQuantity={increaseQuantity}
            decreaseQuantity={decreaseQuantity}
            removeItem={removeItem}
            dispatch={dispatch}
            totalAmount={totalAmount}
          />
        ) : (
          <EmptyCart />
        )}
      </div>
    </>
  );
};

const FullCart = ({
  cart,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
  dispatch,
  totalAmount,
}) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="d-flex justify-content-center p-4">
        <Container className="cart authCard p-5 border rounded w-80">
          {cart.map((item, index) => (
            <Card
              key={index}
              className="d-flex flex-column flex-md-row align-items-center gap-4 p-3 w-100 mb-3"
            >
              <div className="d-flex align-items-center gap-4">
                <Card.Img
                  variant="top"
                  src={item?.poster}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
                <div className="d-flex flex-column flex-md-row align-items-center gap-4">
                  <Card.Body className="text-center text-md-start">
                    <Card.Title>{item?.title}</Card.Title>
                  </Card.Body>
                  <Card.Text className="text-center">${item?.price}</Card.Text>
                </div>
              </div>
              <div className="d-flex flex-column flex-md-row align-items-center gap-4">
                <Card.Body className="d-flex align-items-center">
                  <Button
                    className="btn-secondary btn-sm mx-2"
                    onClick={() => dispatch(decreaseQuantity(item))}
                  >
                    -
                  </Button>
                  {item?.quantity}
                  <Button
                    className="btn-danger btn-sm mx-2"
                    onClick={() => dispatch(increaseQuantity(item))}
                  >
                    +
                  </Button>
                </Card.Body>
                <Card.Text className="text-center">
                  {item?.seats - item?.quantity} Seats Remaining
                </Card.Text>
                <Card.Text className="text-center">
                  $
                  <span className=" fw-bold">
                    {item?.price * item?.quantity}
                  </span>
                </Card.Text>
                <Button variant="link" className="text-center">
                  <RiDeleteBin6Line
                    color="red"
                    onClick={() => dispatch(removeItem(item?.slug))}
                  />
                </Button>
              </div>
            </Card>
          ))}
          <Table bordered className="w-100 mt-4">
            <tbody>
              <tr>
                <td className="fw-bold text-center text-md-start">TOTAL</td>
                <td className="fw-bold text-center text-md-end">
                  ${totalAmount()}
                </td>
              </tr>
            </tbody>
          </Table>
          <div className="d-flex flex-column flex-md-row justify-content-md-start align-items-md-center w-100 gap-2 gap-md-4">
            <Button variant="danger" onClick={() => dispatch(removeAll())}>
              REMOVE ALL ITEMS
            </Button>
            <Button variant="secondary" onClick={() => navigate("/checkout")}>
              PROCEED TO CHECKOUT
            </Button>
          </div>
        </Container>
      </div>
    </>
  );
};

const EmptyCart = () => {
  return (
    <>
      <h1>No Items In Cart</h1>
      <Link to="/">
        <Button
          variant="secondary"
          className="d-flex align-items-center text-decoration-none"
        >
          Start Shopping
        </Button>
      </Link>
    </>
  );
};

export default Cart;
