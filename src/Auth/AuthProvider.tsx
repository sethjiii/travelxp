"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

type User = {
  email: string;
  name: string;
  role: string;
  avatarUrl?: string;
  token?: string;
  _id?: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // ✅ Load user from localStorage when app starts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  // ✅ Persist user changes to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", user.token || "");
      localStorage.setItem("email", user.email);
      localStorage.setItem("name", user.name);
      localStorage.setItem("role", user.role);
      localStorage.setItem("_id", user._id || "");
    } else {
      localStorage.clear(); // Clear all if logged out
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting login with email:", email);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        const userData: User = {
          ...data.user,
          token: data.user.token,
        };

        setUser(userData);
        setIsAuthenticated(true);

        console.log("Login successful:", userData);

        // Redirect based on role
        router.push(userData.role === "admin" ? "/admin" : "/");
      } else {
        console.error("Login failed:", data.error);
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again later.");
    }
  };

  const logout = () => {
    console.log("Logging out...");
    document.cookie = "token=; max-age=0; path=/";
    setUser(null);
    setIsAuthenticated(false);
    localStorage.clear();
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
