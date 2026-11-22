import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, ButtonGroup, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import type { AppDispatch } from "../redux/store";
import { clearCart, removeFromCart, selectCartCount, selectCartItems, selectCartTotal, updateCount, } from "../redux/cartSlice";
import ProductImage from "../components/ProductImage";
import { useAuth } from "../context/authContext";
import { useCreateOrder } from "../hooks/useOrders";


const CartPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector(selectCartItems);
  const totalCount = useSelector(selectCartCount);
  const totalPrice = useSelector(selectCartTotal);


  const navigate = useNavigate();
  const { user } = useAuth();
  const createOrder = useCreateOrder();
  const [orderId, setOrderId] = useState<string | null>(null); // replaces checkedOut const  
  const [error, setError] = useState<string | null>(null);

const handleCheckout = async () => {
  if (!user) {
    navigate("/login"); // must be logged in to place an order
    return;
  }
  setError(null);
  try {
    const id = await createOrder.mutateAsync({ userId: user.uid, items });
    dispatch(clearCart()); // only clear the cart after the order saved
    setOrderId(id);
  } catch (err) {
    setError(err instanceof Error ? err.message : "Couldn't place your order.");
  }
};



  if (orderId) {
    return (
      <Container>
        <Alert variant="success">
          <Alert.Heading>Thanks for your order!</Alert.Heading>
          <p className="mb-0">Order ID: {orderId}</p>
        </Alert>
        <Link to={`/orders/${orderId}`} className="btn btn-primary me-2">
          View order
        </Link>
        <Link to="/" className="btn btn-outline-primary">
          Keep shopping
        </Link>
      </Container>
    );
  }


  if (items.length === 0) {
    return (
      <Container>
        <Alert variant="info">Your cart is empty.</Alert>
        <Link to="/" className="btn btn-primary">
          Browse products
        </Link>
      </Container>
    );
  }

  return (
    <Container className="pb-5">
      <h1 className="h3 mb-4">Your Cart</h1>
      <Row className="g-4">
        <Col lg={8}>
          <ListGroup>
            {items.map((item) => (
              <ListGroup.Item
                key={item.id}
                className="d-flex flex-wrap align-items-center gap-3"
              >
                <ProductImage src={item.image} alt={item.title} className="cart-image" />

                <div className="flex-grow-1" style={{ minWidth: 150 }}>
                  <div className="fw-semibold">{item.title}</div>
                  <div className="text-muted small">${item.price.toFixed(2)} each</div>
                </div>

                <ButtonGroup size="sm">
                  <Button
                    variant="outline-secondary"
                    onClick={() => dispatch(updateCount({ id: item.id, count: item.count - 1 }))}
                  >
                    −
                  </Button>
                  <Button variant="outline-secondary" disabled>
                    {item.count}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => dispatch(updateCount({ id: item.id, count: item.count + 1 }))}
                  >
                    +
                  </Button>
                </ButtonGroup>

                <strong style={{ minWidth: 80 }} className="text-end">
                  ${(item.price * item.count).toFixed(2)}
                </strong>

                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => dispatch(removeFromCart(item.id))}
                >
                  Remove
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        <Col lg={4}>
          <Card>
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <div className="d-flex justify-content-between">
                <span>Total items</span>
                <span>{totalCount}</span>
              </div>
              <div className="d-flex justify-content-between fw-bold fs-5 my-3">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              {error && <Alert variant="danger">{error}</Alert>}
              <Button variant="success" className="w-100" onClick={handleCheckout} disabled={createOrder.isPending}>
                {createOrder.isPending
                  ? "Placing order..."
                  : user
                    ? "Place order"
                    : "Log in to check out"}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
