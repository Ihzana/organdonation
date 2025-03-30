import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import {logindonor,loginhospital,loginrecip} from "../api"
export default function LoginPage({ setIsAuthenticated }) {


  const[entity , setentity] = useState("donor")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handlelogin = async(e) => {
    e.preventDefault();
    if(entity === "donor"){
      try {
          const result = await logindonor(email, password);
          console.log("Signin Success:", result.data);
          const donor = result.data;
          alert("Signin successful as donor");
          setIsAuthenticated(true)
          navigate("/donor",{state :donor});
        } catch (error) {
          // alert("Signup failed. Try again.");
          console.log("Signin eroor:", error);
        }
    }
    else if(entity === "recipient"){
      try {
          const result = await loginrecip(email, password);
          console.log("Signin Success:", result);
          const recp = result.data;
          
          alert("Signin successful as recipient!");
          setIsAuthenticated(true)
          navigate("/recipient",{state :recp});
        } catch (error) {
          alert("Signin failed. Try again.");
        }
    }else if(entity === "admin"){
      if(email === "spider@gmail.com"&& password ==="1234"){
        setIsAuthenticated(true)
        navigate("/admin");
      }
    }
    
    else{
      try {
        const result = await loginhospital(email, password);
        console.log("Signin Success:", result);
        const hospital = result.data;
        alert("Signin successful as hospital!");
        setIsAuthenticated(true)
        navigate("/hospital",{state :hospital});
      } catch (error) {
        alert("Signin failed as hospital. Try again.");
      }
    }
    
  };
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800">Organ Donation Login</h2>
          <p className="text-gray-600 mt-2">Choose your role and log in to continue.</p>
          
          <div className="mt-4">
            <select className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={entity} onChange={(e) => setentity(e.target.value)}>
              <option value="donor">Donor</option>
              <option value="recipient">Recipient</option>
              <option value="hospital">Hospital</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <input 
            type="email" 
            placeholder="Email" 
            className="mt-4 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            className="mt-4 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <button className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={handlelogin}
          >
            Login
          </button>

              <p className="text-gray-700">
      Don't have an account?{' '}
      <a href="/signup" className="text-blue-600 hover:underline font-medium">
        Sign up
      </a>
    </p>

        </div>
      </div>
    );
  }