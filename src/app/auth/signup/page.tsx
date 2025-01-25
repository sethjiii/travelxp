// app/signup/page.tsx
"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react';
import { Input } from "../../components/InputProps";
import Link from 'next/link';
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router=useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        })
      });
      
      if (response.ok) {
        // Handle successful registration (you can redirect or show a success message)

        const data = await response.json();
        router.push("/auth/login");
        console.log('Registration successful', data);
      } else {
        // Handle error (e.g., show error message)
        const data = await response.json();
        setErrors({ general: data.message || 'Something went wrong. Please try again.' });
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setErrors({ general: 'Something went wrong. Please try again.' });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="relative h-40 sm:h-48 bg-blue-600">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-90"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">Start Your Journey</h2>
            <p className="text-blue-100 mt-2 text-center">Create an account to begin exploring</p>
          </div>
        </div>
        
        {/* Form */}
        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                icon={User}
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
                error={errors.fullName}
              />
              
              <Input
                icon={Mail}
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                error={errors.email}
              />
              
              <Input
                icon={Phone}
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                error={errors.phone}
              />
              
              <div className="relative">
                <Input
                  icon={Lock}
                  type={showPassword ? 'text' : 'password'}
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
              
              <Input
                icon={Lock}
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                error={errors.confirmPassword}
              />
            </div>

            {/* Error message */}
            {errors.general && (
              <p className="text-red-500 text-center">{errors.general}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 
                transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50
                flex items-center justify-center gap-2 font-medium shadow-lg shadow-blue-500/30"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/login"
                className="text-blue-600 hover:text-blue-800 font-medium">Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
