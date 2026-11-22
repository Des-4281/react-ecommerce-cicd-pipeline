import { useState } from "react";
import type { SubmitEvent } from "react"; 
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { auth } from "../firebaseConfig";
import { authErrorMessage } from "../authErrors";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

const handleLogin = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
        setError(authErrorMessage(err));
    }
  };
  
    return (
    <Container style={{ maxWidth: 420 }}>
      <h1 className="mb-4">Log in</h1>
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3" controlId="loginEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="loginPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        {error && <Alert variant="danger">{error}</Alert>}
        <Button type="submit" className="w-100">Log in</Button>
      </Form>
      <p className="mt-3">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </Container>
  );
};

export default LoginPage;