import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {fetchRecipients} from "../api"

export const HospitalDashboard = () => {
  const [recipients, setRecipients] = useState([]);
  const [donors, setDonors] = useState([]);
  const location = useLocation();
  const hospital = location.state;
  console.log(hospital.username)


  const loadData = async (username) => {
    try {
      const recipientData = await fetchRecipients(username);
  
      console.log("Fetched Recipients:", recipientData); // Debugging log
  
      // If using fetch, recipientData is already JSON (no `.data` like axios)
      setRecipients(recipientData);
  
    } catch (error) {
      console.error("Error loading recipient data:", error.message);
    }
  };
  useEffect(() => {

    loadData(hospital.username);
  }, []);
  

  return (
    <div style={{ padding: "20px", display: "grid", gap: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Hospital Dashboard</h1>
      
      <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", boxShadow: "2px 2px 10px rgba(0,0,0,0.1)" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "10px" }}>Recipients</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {recipients.map((recipient) => (
            <div key={recipient.id} style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "6px" }}>
              <p><strong>Name:</strong> {recipient.name}</p>
              <p><strong>Organ Needed:</strong> {recipient.organ}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", boxShadow: "2px 2px 10px rgba(0,0,0,0.1)" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "10px" }}>Donors</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* {donors.map((donor) => (
            <div key={donor.id} style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "6px" }}>
              <p><strong>Donor Name:</strong> {donor.name}</p>
              <p><strong>Organ Donated:</strong> {donor.organ}</p>
              <p><strong>Status:</strong> {donor.status}</p>
            </div>
          ))} */}
        </div>
      </div>
    </div>
  );
};

export default {HospitalDashboard};
