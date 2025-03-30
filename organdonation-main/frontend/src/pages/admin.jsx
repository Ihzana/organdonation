import React, { useState, useEffect } from "react";
import { getrecipientlistadmin, getdonationadmin, gethospitaladmin } from "../api";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("recipients");
  const [recipients, setRecipients] = useState([]);
  const [donations, setDonations] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [recipientsData, donationsData, hospitalsData] = await Promise.all([
        getrecipientlistadmin(),
        getdonationadmin(),
        gethospitaladmin()
      ]);
      
      setRecipients(recipientsData);
      setDonations(donationsData);
      setHospitals(hospitalsData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch data. Please try again later.");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filterData = (data) => {
    if (!searchTerm) return data;
    return data.filter((item) => 
      Object.values(item)
        .some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  };

  const renderTable = (data, columns) => {
    const filteredData = filterData(data);
    
    if (loading) {
      return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;
    }
    
    if (error) {
      return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>;
    }
    
    if (filteredData.length === 0) {
      return <div className="text-center p-4">No data found{searchTerm ? " matching your search" : ""}.</div>;
    }

    return (
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white">
              {columns.map((col, index) => (
                <th key={index} className="p-3 text-left">{col}</th>
              ))}
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredData.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b hover:bg-gray-100 transition-colors">
                {Object.values(row).map((value, colIndex) => (
                  <td key={colIndex} className="p-3">{value}</td>
                ))}
                <td className="p-3">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded mr-2">
                    Edit
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const getTabSummary = () => {
    const data = {
      recipients: recipients.length,
      donations: donations.length,
      hospitals: hospitals.length
    };
    
    return (
      <div className="grid grid-cols-3 gap-4 mb-6">
        {Object.entries(data).map(([key, value]) => (
          <div 
            key={key}
            className={`p-4 rounded-lg shadow-md ${activeTab === key ? 'bg-blue-100 border-blue-500 border-l-4' : 'bg-white'}`}
            onClick={() => setActiveTab(key)}
          >
            <h3 className="text-lg font-semibold capitalize">{key}</h3>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/5 bg-gray-800 text-white">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        </div>
        <nav className="mt-4">
          <ul>
            <li className={`p-3 cursor-pointer hover:bg-gray-700 flex items-center ${activeTab === "recipients" ? "bg-gray-700" : ""}`} onClick={() => setActiveTab("recipients")}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Recipients
            </li>
            <li className={`p-3 cursor-pointer hover:bg-gray-700 flex items-center ${activeTab === "donations" ? "bg-gray-700" : ""}`} onClick={() => setActiveTab("donations")}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              Donations
            </li>
            <li className={`p-3 cursor-pointer hover:bg-gray-700 flex items-center ${activeTab === "hospitals" ? "bg-gray-700" : ""}`} onClick={() => setActiveTab("hospitals")}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm5 5a1 1 0 10-2 0v4a1 1 0 102 0V9zm4-1a1 1 0 00-1 1v4a1 1 0 102 0V9a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Hospitals
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-0 w-1/5 p-4 bg-gray-900">
          <button 
            onClick={() => fetchData()} 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Refresh Data
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="w-4/5 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold capitalize">{activeTab} Management</h2>
          <div className="flex items-center">
            <div className="relative mr-4">
              <input
                type="text"
                placeholder="Search..."
                className="border rounded-lg py-2 px-4 pl-10 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add New {activeTab.slice(0, -1)}
            </button>
          </div>
        </div>

        {getTabSummary()}

        {activeTab === "recipients" && renderTable(recipients, ["ID", "Name", "Hospital"])}
        {activeTab === "donations" && renderTable(donations, ["ID", "Donor Name", "Organ", "Hospital", "Status"])}
        {activeTab === "hospitals" && renderTable(hospitals, ["ID", "Name"])}
      </div>
    </div>
  );
};

export default AdminDashboard;
