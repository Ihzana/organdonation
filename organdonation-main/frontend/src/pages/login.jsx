import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { logindonor, loginhospital, loginrecip } from "../api";

export default function LoginPage({ setIsAuthenticated }) {
  // State management
  const [formData, setFormData] = useState({
    entity: "donor",
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing again
    if (error) setError(null);
  };

  // Form validation
  const validateForm = () => {
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    
    return true;
  };

  // Login handler functions for different entity types
  const loginHandlers = {
    donor: async () => {
      try {
        const result = await logindonor(formData.email, formData.password);
        setIsAuthenticated(true);
        navigate("/donor", { state: result.data });
        return "Logged in successfully as donor";
      } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to login as donor");
      }
    },
    
    recipient: async () => {
      try {
        const result = await loginrecip(formData.email, formData.password);
        setIsAuthenticated(true);
        navigate("/recipient", { state: result.data });
        return "Logged in successfully as recipient";
      } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to login as recipient");
      }
    },
    
    hospital: async () => {
      try {
        const result = await loginhospital(formData.email, formData.password);
        setIsAuthenticated(true);
        navigate("/hospital", { state: result.data });
        return "Logged in successfully as hospital";
      } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to login as hospital");
      }
    },
    
    admin: async () => {
      // Hard-coded admin credentials (in a real app, this should be handled differently)
      if (formData.email === "spider@gmail.com" && formData.password === "1234") {
        setIsAuthenticated(true);
        navigate("/admin");
        return "Logged in successfully as admin";
      } else {
        throw new Error("Invalid admin credentials");
      }
    }
  };

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validate form before proceeding
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const loginHandler = loginHandlers[formData.entity];
      if (!loginHandler) {
        throw new Error("Invalid entity type");
      }
      
      const successMessage = await loginHandler();
      
      // Show success message
      showNotification(successMessage, "success");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Simple notification helper (replace with toast in a real app)
  const showNotification = (message, type = "error") => {
    if (type === "success") {
      alert(message); // Replace with a better UI notification
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-1">Welcome Back</h2>
        <p className="text-gray-600 mb-6">Sign in to continue to the Organ Donation portal</p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="entity" className="sr-only">Role</label>
            <select
              id="entity"
              name="entity"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={formData.entity}
              onChange={handleChange}
            >
              <option value="donor">Donor</option>
              <option value="recipient">Recipient</option>
              <option value="hospital">Hospital</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input 
              id="email"
              name="email"
              type="email" 
              placeholder="Email" 
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input 
              id="password"
              name="password"
              type="password" 
              placeholder="Password" 
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          
          <button 
            type="submit"
            className={`w-full px-4 py-3 rounded-lg text-white font-medium transition
              ${isLoading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'}`}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-gray-700">
            Don't have an account?{' '}
            <a href="/signup" className="text-blue-600 hover:underline font-medium">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
