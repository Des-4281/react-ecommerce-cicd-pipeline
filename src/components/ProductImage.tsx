import { useState } from "react";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
}

const ProductImage = ({ src, alt, className }: ProductImageProps) => {
  const [failed, setFailed] = useState(false);

  return (
    <img
      src={failed ? "/placeholder.svg" : src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
};

export default ProductImage;

