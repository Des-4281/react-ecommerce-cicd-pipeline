import { Link, useParams } from "react-router-dom";
import { Alert, Container, ListGroup, Spinner } from "react-bootstrap";
import { useOrder } from "../hooks/useOrders";
import { formatOrderDate } from "../api/orders";
import ProductImage from "../components/ProductImage";

const OrderDetailPage = () => {
  const { orderId } = useParams(); 
  const order = useOrder(orderId);

  return (
    <Container className="pb-5" style={{ maxWidth: 720 }}>
      <Link to="/orders">&larr; Back to orders</Link>

      {order.isLoading && (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      )}
      {order.isError && (
        <Alert variant="danger" className="mt-3">{order.error.message}</Alert>
      )}

      {order.data && (
        <>
          <h1 className="h4 mt-3">Order {order.data.id}</h1>
          <p className="text-muted">Placed {formatOrderDate(order.data)}</p>

          <ListGroup className="mb-3">
            {order.data.items.map((item) => (
              <ListGroup.Item key={item.id} className="d-flex align-items-center gap-3">
                <ProductImage src={item.image} alt={item.title} className="cart-image" />
                <div className="flex-grow-1">
                  <div className="fw-semibold">{item.title}</div>
                  <div className="text-muted small">
                    {item.count} × ${item.price.toFixed(2)}
                  </div>
                </div>
                <strong>${(item.price * item.count).toFixed(2)}</strong>
              </ListGroup.Item>
            ))}
          </ListGroup>

          <div className="d-flex justify-content-between fw-bold fs-5">
            <span>Total ({order.data.totalItems} items)</span>
            <span>${order.data.total.toFixed(2)}</span>
          </div>
        </>
      )}
    </Container>
  );
};

export default OrderDetailPage;