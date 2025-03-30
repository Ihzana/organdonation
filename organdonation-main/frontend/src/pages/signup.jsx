import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { signupdonor, signuphosp, signuprecp } from "../api";

export function SignupPage() {
  // State management
  const [formState, setFormState] = useState({
    entity: "donor",
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formState.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    // Email validation
    if (!formState.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = "Email address is invalid";
    }
    
    // Password validation
    if (!formState.password) {
      newErrors.password = "Password is required";
    } else if (formState.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    // Confirm password validation
    if (formState.password !== formState.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle signup form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    const { entity, email, password, name } = formState;
    
    try {
      let result;
      
      if (entity === "donor") {
        result = await signupdonor(email, password, name);
        navigate("/donor");
      } else if (entity === "recipient") {
        result = await signuprecp(email, password, name);
        navigate("/recipient");
      } else {
        result = await signuphosp(email, password, name);
        navigate("/hospital");
      }
      
      console.log("Signup Success:", result);
      // We're using a more modern toast notification approach instead of alert
      // This is where you'd integrate a toast library like react-toastify
    } catch (error) {
      console.error("Signup error:", error);
      setErrors({
        form: error.message || "Signup failed. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Entity type labels for better UX
  const entityLabels = {
    donor: "Organ Donor",
    recipient: "Organ Recipient",
    hospital: "Hospital/Medical Facility"
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Join the Network</h2>
          <p className="text-gray-600 mt-2">
            Create an account to participate in the organ donation system
          </p>
        </div>
        
        <form onSubmit={handleSignup} className="space-y-4">
          {/* Entity selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              I am registering as a:
            </label>
            <select 
              name="entity"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors" 
              value={formState.entity} 
              onChange={handleChange}
            >
              {Object.entries(entityLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          
          {/* Name field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {formState.entity === "hospital" ? "Facility Name" : "Full Name"}
            </label>
            <input 
              type="text" 
              name="name"
              placeholder={formState.entity === "hospital" ? "Hospital or Facility Name" : "Your Full Name"} 
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              value={formState.name}
              onChange={handleChange}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>
          
          {/* Email field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input 
              type="email" 
              name="email"
              placeholder="email@example.com" 
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              value={formState.email}
              onChange={handleChange}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>
          
          {/* Password field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input 
              type="password" 
              name="password"
              placeholder="Create a secure password" 
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              value={formState.password}
              onChange={handleChange}
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>
          
          {/* Confirm Password field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input 
              type="password" 
              name="confirmPassword"
              placeholder="Confirm your password" 
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
              value={formState.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
          </div>
          
          {/* Form error message */}
          {errors.form && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.form}</p>
            </div>
          )}
          
          {/* Submit button */}
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              `Create ${formState.entity === "hospital" ? "Facility" : "User"} Account`
            )}
          </button>
          
          {/* Login link */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <button 
              type="button"
              onClick={() => navigate("/login")}
              className="text-green-600 hover:text-green-800 font-medium"
            >
              Sign in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
