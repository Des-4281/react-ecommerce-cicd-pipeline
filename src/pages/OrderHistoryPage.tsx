import { Link, useNavigate } from "react-router-dom";
import { Alert, Container, Spinner, Table } from "react-bootstrap";
import { useAuth } from "../context/authContext";
import { useOrders } from "../hooks/useOrders";
import { formatOrderDate } from "../api/orders";


const OrderHistoryPage = () => {
  const { user } = useAuth();
  const orders = useOrders(user?.uid);
  const navigate = useNavigate();

  return (
    <Container className="pb-5">
      <h1 className="h3 mb-4">Order History</h1>

      {orders.isLoading && <Spinner animation="border" />}
      {orders.isError && (
        <Alert variant="danger">Couldn't load orders: {orders.error.message}</Alert>
      )}
      {orders.data?.length === 0 && (
        <Alert variant="info">
          No orders yet. <Link to="/">Start shopping</Link>
        </Alert>
      )}

      {orders.data && orders.data.length > 0 && (
        <Table hover responsive className="align-middle">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th className="text-end">Items</th>
              <th className="text-end">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.data.map((order) => (
              <tr
                key={order.id}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                <td>
                  <Link to={`/orders/${order.id}`}>{order.id}</Link>
                </td>
                <td>{formatOrderDate(order)}</td>
                <td className="text-end">{order.totalItems}</td>
                <td className="text-end">${order.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default OrderHistoryPage;