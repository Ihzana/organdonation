import React, { useState,useEffect } from "react";
import {getrecipientlistadmin,getdonationadmin,gethospitaladmin} from "../api"

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("recipients");

  const[reciepient , setRecipients] = useState([]);
  const[donations , setdonations] = useState([]);
  const[hospitals , sethospitals] = useState([]);
  const handlerecip = async()=>{
    const response  = await getrecipientlistadmin();
    setRecipients(response)
  }

  const handledoantion = async()=>{
    const response  = await getdonationadmin();
    setdonations(response)
  }

  const handlehospitals = async()=>{
    const response  = await gethospitaladmin();
    console.log(response)
    sethospitals(response)
  }



//   const donations = [
//     { id: 1, donor: "Alice", recipient: "John Doe", amount: "$100" },
//     { id: 2, donor: "Bob", recipient: "Jane Smith", amount: "$150" },
//   ];

//   const hospitals = [
//     { id: 1, name: "City Hospital", location: "New York" },
//     { id: 2, name: "Green Valley Clinic", location: "California" },
//   ];

//   const donors = [
//     { id: 1, name: "Alice Johnson", bloodType: "B+" },
//     { id: 2, name: "Bob Williams", bloodType: "AB-" },
//   ];

  const renderTable = (data, columns) => (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          {columns.map((col, index) => (
            <th key={index} className="border border-gray-300 p-2">{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} className="border border-gray-300">
            {Object.values(row).map((value, colIndex) => (
              <td key={colIndex} className="border border-gray-300 p-2 text-center">{value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  useEffect(()=>{
    handlerecip();
    handledoantion();
    handlehospitals();
  },[])

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
        <ul>
          <li className="p-2 cursor-pointer hover:bg-gray-600" onClick={() => setActiveTab("recipients")}>
            Recipients
          </li>
          <li className="p-2 cursor-pointer hover:bg-gray-600" onClick={() => setActiveTab("donations")}>
            Donations
          </li>
          <li className="p-2 cursor-pointer hover:bg-gray-600" onClick={() => setActiveTab("hospitals")}>
            Hospitals
          </li>

        </ul>
      </div>
      
      {/* Main Content */}
      <div className="w-3/4 p-6">
        <h2 className="text-2xl font-bold mb-4 capitalize">{activeTab} List</h2>
        {activeTab === "recipients" && renderTable(reciepient, ["ID", "Name","Name of the hospital"])}
        {activeTab === "donations" && renderTable(donations, ["id" ," donor_name" ," organ"," hospital" ," status " ])}
        {activeTab === "hospitals" && renderTable(hospitals, ["ID", "Name"])}

      </div>
    </div>
  );
};

export default AdminDashboard;
