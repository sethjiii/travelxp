// app/login/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Mail, Lock, Eye, EyeOff, Plane } from "lucide-react";
import Link from "next/link";
import { Input } from "../../components/InputProps";
import { useAuth } from "../../../Auth/AuthProvider";

export default function LoginPage() {
  const { login, user } = useAuth(); // Destructure login function from context
  console.log(user);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<string | null>(null); // Role state
  console.log(role);

  // Retrieve role from localStorage on the client side
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newErrors: Record<string, string> = {};
    if (!formData.email || !formData.password) {
      newErrors.general = "Both fields are required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      console.log("Submitting login:", formData.email, formData.password);
      await login(formData.email, formData.password);
      console.log("Login successful!");

      // console.log(user);

      
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ general: "Invalid credentials. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="relative h-40 sm:h-48 bg-blue-600">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-90"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
            <Plane className="h-12 w-12 text-white mb-3 animate-pulse" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">Welcome Back!</h2>
            <p className="text-blue-100 mt-2 text-center">Sign in to continue your journey</p>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              icon={Mail}
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
              error={errors.email}
            />

            <div className="relative">
              <Input
                icon={Lock}
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                error={errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded" />
                <span className="ml-2 text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 
                transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50
                flex items-center justify-center gap-2 font-medium shadow-lg shadow-blue-500/30"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
