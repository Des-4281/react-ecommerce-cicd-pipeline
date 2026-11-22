import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { Alert, Button, Container, Form, Spinner } from "react-bootstrap";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/authContext";
import { authErrorMessage } from "../authErrors";
import type { UserProfile } from "../types";

const ProfilePage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);


  useEffect(() => {
    if (!user) return;
    const loadProfile = async () => {
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        let data: UserProfile;
        if (snap.exists()) {
          data = snap.data() as UserProfile;
        } else {

          data = { email: user.email ?? "", name: "", address: "" };
          await setDoc(ref, data);
        }
        setProfile(data);
        setName(data.name);
        setAddress(data.address);
      } catch (err) {
        setError(authErrorMessage(err));
      }
    };

    loadProfile();
  }, [user]);


  const handleSave = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setError(null);
    setMessage(null);

    try {
      await updateDoc(doc(db, "users", user.uid), { name, address });
      setProfile((prev) => (prev ? { ...prev, name, address } : prev));
      setMessage("Profile saved.");
    } catch (err) {
      setError(authErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    if (!window.confirm("Delete your account? This can't be undone.")) return;
    setError(null);

    try {
      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);
      navigate("/");
    } catch (err) {
      setError(authErrorMessage(err));
    }
  };

  if (loading) return <Container><Spinner animation="border" /></Container>;
  if (!user) return <Navigate to="/login" replace />;
  if (!profile && !error) return <Container><Spinner animation="border" /></Container>;

  return (
    <Container style={{ maxWidth: 480 }}>
      <h1 className="mb-4">My profile</h1>
      <p className="text-muted">{profile?.email}</p>

      <Form onSubmit={handleSave}>
        <Form.Group className="mb-3" controlId="profileName">
          <Form.Label>Name</Form.Label>
          <Form.Control value={name} onChange={(e) => setName(e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="profileAddress">
          <Form.Label>Address</Form.Label>
          <Form.Control value={address} onChange={(e) => setAddress(e.target.value)} />
        </Form.Group>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        <Button type="submit" className="w-100 mb-3">Save changes</Button>
      </Form>

      <hr />
      <Button variant="outline-danger" className="w-100" onClick={handleDelete}>
        Delete account
      </Button>
    </Container>
  );
};

export default ProfilePage;
