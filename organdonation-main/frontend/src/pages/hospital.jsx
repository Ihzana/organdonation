import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { fetchRecipients, fetchDonors } from "../api";

export const HospitalDashboard = () => {
  const [recipients, setRecipients] = useState([]);
  const [donors, setDonors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("recipients");
  const [searchTerm, setSearchTerm] = useState("");
  const [organFilter, setOrganFilter] = useState("all");
  
  const location = useLocation();
  const hospital = location.state;
  
  const loadData = async (username) => {
    setIsLoading(true);
    try {
      const recipientData = await fetchRecipients(username);
      setRecipients(recipientData);
      
      // Uncomment and modify this when you have the API ready
      const donorData = await fetchDonors(username);
      setDonors(donorData);
    } catch (error) {
      console.error("Error loading data:", error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (hospital && hospital.username) {
      loadData(hospital.username);
    }
  }, [hospital]);
  
  const organs = ["Heart", "Kidney", "Liver", "Lung", "Pancreas", "Cornea"];
  
  const filteredRecipients = recipients.filter(recipient => {
    const matchesSearch = recipient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOrgan = organFilter === "all" || recipient.organ === organFilter;
    return matchesSearch && matchesOrgan;
  });
  
  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOrgan = organFilter === "all" || donor.organ === organFilter;
    return matchesSearch && matchesOrgan;
  });
  
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "available": return "#22c55e"; // green
      case "pending": return "#f59e0b"; // amber
      case "matched": return "#3b82f6"; // blue
      case "transplanted": return "#8b5cf6"; // purple
      default: return "#6b7280"; // gray
    }
  };
  
  const getOrganIcon = (organ) => {
    switch (organ.toLowerCase()) {
      case "heart": return "❤️";
      case "kidney": return "🫘";
      case "liver": return "🫁";
      case "lung": return "🫁";
      case "pancreas": return "🫙";
      case "cornea": return "👁️";
      default: return "🩺";
    }
  };
  
  const getMatchingStats = () => {
    const pendingRecipients = recipients.filter(r => !r.matched).length;
    const availableDonors = donors.filter(d => d.status === "Available").length;
    const successfulMatches = donors.filter(d => d.status === "Transplanted").length;
    
    return { pendingRecipients, availableDonors, successfulMatches };
  };
  
  const stats = getMatchingStats();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-xl">Loading hospital data...</div>
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{hospital.name} Dashboard</h1>
        <p className="text-gray-600">Organ Donation Management System</p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <p className="text-sm text-gray-500">Waiting Recipients</p>
          <p className="text-2xl font-bold text-indigo-600">{stats.pendingRecipients}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <p className="text-sm text-gray-500">Available Donors</p>
          <p className="text-2xl font-bold text-green-600">{stats.availableDonors}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <p className="text-sm text-gray-500">Successful Transplants</p>
          <p className="text-2xl font-bold text-blue-600">{stats.successfulMatches}</p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <select 
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            value={organFilter}
            onChange={e => setOrganFilter(e.target.value)}
          >
            <option value="all">All Organs</option>
            {organs.map(organ => (
              <option key={organ} value={organ}>{organ}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === "recipients" 
            ? "text-indigo-600 border-b-2 border-indigo-600" 
            : "text-gray-500 hover:text-gray-700"}`}
          onClick={() => setActiveTab("recipients")}
        >
          Recipients
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === "donors" 
            ? "text-indigo-600 border-b-2 border-indigo-600" 
            : "text-gray-500 hover:text-gray-700"}`}
          onClick={() => setActiveTab("donors")}
        >
          Donors
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === "matching" 
            ? "text-indigo-600 border-b-2 border-indigo-600" 
            : "text-gray-500 hover:text-gray-700"}`}
          onClick={() => setActiveTab("matching")}
        >
          Match Management
        </button>
      </div>
      
      {/* Content */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        {activeTab === "recipients" && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recipient List</h2>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Add Recipient
              </button>
            </div>
            
            {filteredRecipients.length === 0 ? (
              <p className="text-gray-500 text-center py-6">No recipients found matching your criteria.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRecipients.map((recipient) => (
                  <div key={recipient.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{recipient.name}</h3>
                        <p className="text-gray-600 text-sm">ID: {recipient.id}</p>
                      </div>
                      <span className="text-2xl" title={recipient.organ}>
                        {getOrganIcon(recipient.organ)}
                      </span>
                    </div>
                    <div className="mt-3 space-y-1">
                      <p><span className="font-medium">Organ Needed:</span> {recipient.organ}</p>
                      <p><span className="font-medium">Blood Type:</span> {recipient.bloodType || "Unknown"}</p>
                      <p><span className="font-medium">Status:</span> {recipient.matched ? "Matched" : "Waiting"}</p>
                      <p><span className="font-medium">Wait Time:</span> {recipient.waitTime || "Unknown"}</p>
                    </div>
                    <div className="mt-3 flex justify-end space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-800">View Details</button>
                      <button className="text-indigo-600 hover:text-indigo-800">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        
        {activeTab === "donors" && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Donor List</h2>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Register Donor
              </button>
            </div>
            
            {filteredDonors.length === 0 ? (
              <p className="text-gray-500 text-center py-6">No donors found matching your criteria.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDonors.map((donor) => (
                  <div key={donor.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{donor.name}</h3>
                        <p className="text-gray-600 text-sm">ID: {donor.id}</p>
                      </div>
                      <span className="text-2xl" title={donor.organ}>
                        {getOrganIcon(donor.organ)}
                      </span>
                    </div>
                    <div className="mt-3 space-y-1">
                      <p><span className="font-medium">Organ Donated:</span> {donor.organ}</p>
                      <p><span className="font-medium">Blood Type:</span> {donor.bloodType || "Unknown"}</p>
                      <p>
                        <span className="font-medium">Status:</span> 
                        <span className="ml-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                              style={{backgroundColor: `${getStatusColor(donor.status)}20`, 
                                     color: getStatusColor(donor.status)}}>
                          {donor.status}
                        </span>
                      </p>
                      <p><span className="font-medium">Date Registered:</span> {donor.dateRegistered || "Unknown"}</p>
                    </div>
                    <div className="mt-3 flex justify-end space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-800">View Details</button>
                      <button className="text-indigo-600 hover:text-indigo-800">Update Status</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        
        {activeTab === "matching" && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Match Management</h2>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Find Matches
              </button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-700">
                The matching system identifies potential donor-recipient pairs based on blood type, tissue compatibility, 
                organ size, and other medical criteria. Review and approve matches below.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg divide-y">
              <div className="p-4 bg-green-50">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Potential Match #1</h3>
                  <div className="space-x-2">
                    <button className="px-3 py-1 bg-green-600 text-white text-sm rounded">Approve</button>
                    <button className="px-3 py-1 bg-red-600 text-white text-sm rounded">Decline</button>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="font-semibold">Recipient</p>
                    <p>John Smith</p>
                    <p className="text-sm text-gray-600">Organ: Heart</p>
                    <p className="text-sm text-gray-600">Blood Type: O+</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="font-semibold">Donor</p>
                    <p>Jane Doe</p>
                    <p className="text-sm text-gray-600">Organ: Heart</p>
                    <p className="text-sm text-gray-600">Blood Type: O+</p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">Compatibility: 95% match</p>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Potential Match #2</h3>
                  <div className="space-x-2">
                    <button className="px-3 py-1 bg-green-600 text-white text-sm rounded">Approve</button>
                    <button className="px-3 py-1 bg-red-600 text-white text-sm rounded">Decline</button>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="font-semibold">Recipient</p>
                    <p>Robert Johnson</p>
                    <p className="text-sm text-gray-600">Organ: Kidney</p>
                    <p className="text-sm text-gray-600">Blood Type: A+</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="font-semibold">Donor</p>
                    <p>Maria Garcia</p>
                    <p className="text-sm text-gray-600">Organ: Kidney</p>
                    <p className="text-sm text-gray-600">Blood Type: O-</p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">Compatibility: 87% match</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HospitalDashboard;
