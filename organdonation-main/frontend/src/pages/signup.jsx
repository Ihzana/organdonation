import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import {signupdonor,signuphosp,signuprecp} from "../api"
export function SignupPage() {
  const[entity , setentity] = useState("donor")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name,setname]=useState("");
  const navigate = useNavigate();

  const handleSignup = async(e) => {
    e.preventDefault();
    if(entity === "donor"){
      try {
          const result = await signupdonor(email, password,name);
          console.log("Signup Success:", result);
          alert("Signup successful as donor");
          navigate("/donor" );
        } catch (error) {
          // alert("Signup failed. Try again.");
          console.log("Signup eroor:", error);
        }
    }
    else if(entity === "recipient"){
      try {
          const result = await signuprecp(email, password,name);
          console.log("Signup Success:", result);
          alert("Signup successful as recipient!");
          navigate("/recipient");
        } catch (error) {
          alert("Signup failed. Try again.");
        }
    }else{
      try {
        const result = await signuphosp(email, password,name);
        console.log("Signup Success:", result);
        alert("Signup successful as hospital!");
        navigate("/hospital");
      } catch (error) {
        alert("Signup failed as hospital. Try again.");
      }
    }
    
  };
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800">Organ Donation Sign Up</h2>
          <p className="text-gray-600 mt-2">Create an account to get started.</p>
          
          <div className="mt-4">
            <select className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={entity} onChange={(e) => setentity(e.target.value)}>
              <option value="donor">Donor</option>
              <option value="recipient">Recipient</option>
              <option value="hospital">Hospital</option>
            </select>
          </div>
          
          <input 
            type="text" 
            placeholder=" Name" 
            className="mt-4 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value={name}
            onChange={(e) => setname(e.target.value)}
          />
  
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
          
          <button className="mt-4 w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            onClick={
              handleSignup
            }
          >
            Sign Up
          </button>
        </div>
      </div>
    );
  }