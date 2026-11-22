import { useState } from "react";
import { Alert, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useCategories, useProducts } from "../hooks/useStoreQueries";
import ProductCard from "../components/ProductCard";

const HomePage = () => {
  const [category, setCategory] = useState("");
  const categories = useCategories();
  const products = useProducts(category);

  return (
    <Container className="pb-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <h1 className="h3 mb-0">Products</h1>
        <Form.Select
          aria-label="Filter by category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={categories.isLoading}
          style={{ maxWidth: 250 }}
        >
          <option value="">All categories</option>
          {categories.data?.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Form.Select>
      </div>

      {products.isLoading && (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      )}

      {products.isError && (
        <Alert variant="danger">
          Couldn't load products: {products.error.message}
        </Alert>
      )}

      {products.data && (
        <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
          {products.data.map((product) => (
            <Col key={product.id}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default HomePage;  