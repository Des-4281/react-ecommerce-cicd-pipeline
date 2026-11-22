import { useDispatch } from "react-redux";
import { Badge, Button, Card } from "react-bootstrap";
import type { Product } from "../types";
import type { AppDispatch } from "../redux/store";
import { addToCart } from "../redux/cartSlice";
import ProductImage from "./ProductImage";


interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useDispatch<AppDispatch>();

    return (
    <Card className="h-100">
      <ProductImage
        src={product.image}
        alt={product.title}
        className="product-image card-img-top"
      />
      <Card.Body className="d-flex flex-column">
        <Badge bg="secondary" className="mb-2 align-self-start text-capitalize">
          {product.category}
        </Badge>
        <Card.Title className="fs-6">{product.title}</Card.Title>
        <Card.Text className="small text-muted">{product.description}</Card.Text>

        <div className="mt-auto">
          <div className="d-flex justify-content-between mb-2">
            <strong>${product.price.toFixed(2)}</strong>
            {product.rating && <span>{product.rating.rate}</span>}
          </div>
          <Button
            variant="primary"
            className="w-100"
            onClick={() => dispatch(addToCart(product))}
          >
            Add to Cart
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;