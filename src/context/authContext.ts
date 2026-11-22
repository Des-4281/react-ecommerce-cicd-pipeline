import { createContext, useContext } from "react";
import type { User } from "firebase/auth";

interface AuthState {
  user: User | null; 
  loading: boolean; 
}

export const AuthContext = createContext<AuthState>({ user: null, loading: true });

export const useAuth = () => useContext(AuthContext);