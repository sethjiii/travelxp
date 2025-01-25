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
  avatarUrl?: string; // Optional, in case you have a user avatar
  token?: string; // Optional, if you are storing JWT
  _id?: string; // Optional, for user identification
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

  // Initialize user state from localStorage on load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  // Sync user state with localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
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

      if (response.ok) {
        setIsAuthenticated(true);
        setUser(data.user);

        // Save user data to localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.user.token || "");
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("name", data.user.name);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("_id", data.user._id || "");

        console.log("Login successful:", data.user);

        console.log("user88")
        console.log(user)
        console.log("user88")


        // Redirect based on user role
        if (data.user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
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
    document.cookie = "token=; max-age=0; path=/"; // Clear token if stored in cookies
    setIsAuthenticated(false);
    setUser(null); // Clear user state
    localStorage.clear(); // Clear all localStorage data
    router.push("/login"); // Redirect to login page
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
