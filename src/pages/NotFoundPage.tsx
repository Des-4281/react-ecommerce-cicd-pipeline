import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

const NotFoundPage = () => (
  <Container className="text-center">
    <h1>Page not found</h1>
    <p>That page doesn't exist.</p>
    <Link to="/">Go home</Link>
  </Container>
);

export default NotFoundPage;
