import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navbar, Nav, Container, Badge, Button } from "react-bootstrap";
import { selectCartCount } from "../redux/cartSlice";
import { signOut } from "firebase/auth"; 
import { auth } from "../firebaseConfig";
import { useAuth } from "../context/authContext";
const NavBar = () => {
  const cartCount = useSelector(selectCartCount);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { 
      await signOut(auth);
      navigate("/");
    } catch (err) { 
      console.error("Logout error:", err);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="md" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          E-Commerce Store
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Products</Nav.Link>
            <Nav.Link as={Link} to="/cart">
              Cart <Badge bg="light" text="dark">{cartCount}</Badge>
            </Nav.Link>
            {!loading && 
              (user ? (
                <>
                  <Nav.Link as={Link} to="/profile">Profile</Nav.Link> 
                  <Nav.Link as={Link} to="/orders">Orders</Nav.Link>
                  <Nav.Link as={Link} to="/admin/products">Manage Products</Nav.Link>
                  <Navbar.Text className="ms-md-3">{user.email}</Navbar.Text>
                  <Button
                    variant="outline-light"
                    size="sm"
                    className="ms-md-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login">Login</Nav.Link>
                  <Nav.Link as={Link} to="/register">Register</Nav.Link>
                </>
              ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
