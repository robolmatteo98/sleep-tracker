import { createContext, useContext, useState, ReactNode } from "react";

type AuthProps = {
  isAuthenticated: boolean;
  userId: number | null;
  login: (id: number) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  const login = (id: number) => {
    setIsAuthenticated(true);
    setUserId(id);
  }
  const logout = () => {
    setIsAuthenticated(false);
    setUserId(null);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}