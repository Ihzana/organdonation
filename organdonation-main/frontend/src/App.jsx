import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import LoginPage from './pages/login'
import { SignupPage } from './pages/signup'
import DonorDashboard from "./pages/donor"
import RecipientDashboard from './pages/recipient';
import {HospitalDashboard} from "./pages/hospital"

import AdminDashboard from "./pages/admin"
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
      <Router>
        <Routes>
          {/* If not authenticated, show Login page first */}
          <Route
            path="/"
            element={
              isAuthenticated ? <DonorDashboard /> : <Navigate to="/login" replace />
            }
          />
          <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/donor" element={<DonorDashboard />} />
          <Route path="/recipient" element={<RecipientDashboard />} />
          <Route path="/hospital" element={<HospitalDashboard/>} />
          <Route path="/admin" element={<AdminDashboard/>} />
          {/* <Route path="/admin" element={<Admin/>} /> */}
        </Routes>
      </Router>
  );
  
  
}

export default App
