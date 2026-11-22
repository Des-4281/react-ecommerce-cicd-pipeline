import { useState } from "react";
import type { SubmitEvent } from "react";
import { Alert, Button, Card, Container, Form, Spinner, Table } from "react-bootstrap";
import { useProductMutations, useProducts } from "../hooks/useStoreQueries";
import ProductImage from "../components/ProductImage";
import type { Product, ProductInput } from "../types";

const emptyForm = { title: "", price: "", category: "", description: "", image: "" };
type FormFields = typeof emptyForm;

const AdminProductsPage = () => {
  const products = useProducts("");
  const { create, update, remove, seed } = useProductMutations();
  const [form, setForm] = useState<FormFields>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null); // null = adding a new one
  const [error, setError] = useState<string | null>(null);

  const setField = (field: keyof FormFields, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const showError = (err: unknown) =>
    setError(err instanceof Error ? err.message : "Something went wrong.");

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const data: ProductInput = {
      title: form.title.trim(),
      price: Number(form.price),
      category: form.category.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
    };

    try {
      if (editingId) {
        await update.mutateAsync({ id: editingId, changes: data });
      } else {
        await create.mutateAsync(data);
      }
      resetForm();
    } catch (err) {
      showError(err);
    }
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      title: product.title,
      price: String(product.price),
      category: product.category,
      description: product.description,
      image: product.image,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Delete "${product.title}"?`)) return;
    setError(null);
    try {
      await remove.mutateAsync(product.id);
      if (editingId === product.id) resetForm();
    } catch (err) {
      showError(err);
    }
  };

  const handleSeed = async () => {
    setError(null);
    try {
      await seed.mutateAsync();
    } catch (err) {
      showError(err);
    }
  };

  const saving = create.isPending || update.isPending;


  return (
    <Container className="pb-5">
      <h1 className="h3 mb-4">Manage Products</h1>
      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>{editingId ? "Edit product" : "Add a product"}</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="productTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="productPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setField("price", e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="productCategory">
              <Form.Label>Category</Form.Label>
              <Form.Control
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="productImage">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="url"
                value={form.image}
                onChange={(e) => setField("image", e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="productDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
              />
            </Form.Group>
            <div className="d-flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Save changes" : "Add product"}
              </Button>
              {editingId && (
                <Button variant="secondary" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>

      {products.isLoading && <Spinner animation="border" />}
      {products.isError && (
        <Alert variant="danger">Couldn't load products: {products.error.message}</Alert>
      )}

      {/* Only shows while the collection is empty: the one-time import */}
      {products.data?.length === 0 && (
        <Alert variant="info">
          No products in Firestore yet.
          <Button size="sm" className="ms-2" onClick={handleSeed} disabled={seed.isPending}>
            {seed.isPending ? "Importing..." : "Import FakeStore products"}
          </Button>
        </Alert>
      )}

      {products.data && products.data.length > 0 && (
        <Table responsive hover className="align-middle">
          <thead>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Category</th>
              <th className="text-end">Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.data.map((product) => (
              <tr key={product.id}>
                <td>
                  <ProductImage src={product.image} alt={product.title} className="cart-image" />
                </td>
                <td>{product.title}</td>
                <td className="text-capitalize">{product.category}</td>
                <td className="text-end">${product.price.toFixed(2)}</td>
                <td className="text-end text-nowrap">
                  <Button
                    size="sm"
                    variant="outline-primary"
                    className="me-2"
                    onClick={() => startEdit(product)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    disabled={remove.isPending}
                    onClick={() => handleDelete(product)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AdminProductsPage;