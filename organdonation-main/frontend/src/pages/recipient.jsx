import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getDonationavailable, insertrecp, getrecipientlist, deleterecp } from "../api";

export default function RecipientDashboard() {
  const [requests, setRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [hospitalName, setHospitalName] = useState("");
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOrgan, setFilterOrgan] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  
  const location = useLocation();
  const recp = location.state;

  // Fetch data functions
  const fetchDonations = async () => {
    try {
      setLoading(true);
      const data = await getDonationavailable();
      setDonations(data);
      setFilteredDonations(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching donations:", error);
      setError("Failed to load available donations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  const fetchRecipient = async () => {
    try {
      setLoading(true);
      const data = await getrecipientlist(recp.username);
      setRequests(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching recipient requests:", error);
      setError("Failed to load your requests. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Show notification helper
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Handle add request
  const handleAdd = async () => {
    if (!selectedDonation) {
      showNotification("Please select a donation first", "error");
      return;
    }
    
    if (!hospitalName.trim()) {
      showNotification("Please enter a hospital name", "error");
      return;
    }
    
    try {
      setLoading(true);
      const response = await insertrecp(selectedDonation, recp.username, hospitalName);
      
      if (response.status === 201) {
        showNotification("Request added successfully!", "success");
        setHospitalName("");
        setSelectedDonation(null);
      } else {
        showNotification("Failed to add request. Please try again.", "error");
      }
      
      await Promise.all([fetchDonations(), fetchRecipient()]);
    } catch (error) {
      console.error("Error adding request:", error);
      showNotification("An error occurred while adding request.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete request
  const handleDelete = async (donorId, id) => {
    if (!confirm("Are you sure you want to delete this request?")) return;
    
    try {
      setLoading(true);
      const response = await deleterecp(donorId, id);
      
      if (response.status === 201) {
        showNotification("Request deleted successfully!", "success");
      } else {
        showNotification("Failed to delete request. Please try again.", "error");
      }
      
      await Promise.all([fetchDonations(), fetchRecipient()]);
    } catch (error) {
      console.error("Error deleting request:", error);
      showNotification("An error occurred while deleting request.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to donations
  useEffect(() => {
    const filtered = donations.filter(donation => {
      // Filter by organ type
      const matchesOrgan = filterOrgan ? donation.organ.toLowerCase() === filterOrgan.toLowerCase() : true;
      
      // Filter by search term (hospital or other attributes)
      const matchesSearch = searchTerm 
        ? donation.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
          donation.organ.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      
      return matchesOrgan && matchesSearch;
    });
    
    setFilteredDonations(filtered);
  }, [searchTerm, filterOrgan, donations]);

  // Initial data fetch
  useEffect(() => {
    fetchDonations();
    fetchRecipient();
  }, []);

  // Get unique organ types for filter dropdown
  const organTypes = [...new Set(donations.map(donation => donation.organ))];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-green-600 text-white py-4 px-6 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold">Recipient Dashboard</h1>
        <div className="text-sm">
          <p>Logged in as: <span className="font-bold">{recp.username}</span></p>
        </div>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
          notification.type === "success" ? "bg-green-500" : "bg-red-500"
        } text-white transition-all duration-300`}>
          {notification.message}
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-6 p-6 max-w-6xl mx-auto">
        {/* Available Donations */}
        <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Available Donations</h3>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Search by hospital or organ..."
              />
            </div>
            <select
              value={filterOrgan}
              onChange={(e) => setFilterOrgan(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg bg-white"
            >
              <option value="">All Organs</option>
              {organTypes.map(organ => (
                <option key={organ} value={organ}>{organ}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 p-4 bg-red-50 rounded-lg">
              {error}
            </div>
          ) : filteredDonations.length === 0 ? (
            <p className="text-gray-600 mt-2 p-4 bg-gray-50 rounded-lg">
              No donations available matching your criteria.
            </p>
          ) : (
            <ul className="mt-3 space-y-3 max-h-72 overflow-y-auto pr-2">
              {filteredDonations.map((donation) => (
                <li
                  key={donation.id}
                  className={`p-4 rounded-lg transition-all duration-200 ${
                    selectedDonation === donation.id 
                      ? "bg-green-100 border-2 border-green-500" 
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="donation"
                      value={donation.id}
                      checked={selectedDonation === donation.id}
                      onChange={() => setSelectedDonation(donation.id)}
                      className="mt-1 form-radio text-green-600 h-5 w-5"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="text-green-700 font-bold text-lg">
                          {donation.organ}
                        </p>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          donation.status === "available" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {donation.status}
                        </span>
                      </div>
                      <p className="text-gray-700 font-medium">
                        Hospital: {donation.hospital}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Date: {new Date(donation.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Request Form */}
          <div className="mt-5 pt-5 border-t border-gray-200">
            <h4 className="font-bold text-lg text-gray-800 mb-3">Request Selected Donation</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Hospital for Transplant:</label>
                <input
                  type="text"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className="block w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500"
                  placeholder="Enter hospital name"
                />
              </div>
              <button 
                onClick={handleAdd}
                disabled={loading || !selectedDonation || !hospitalName.trim()}
                className={`w-full py-3 rounded-lg font-medium transition-all duration-200 
                  ${loading || !selectedDonation || !hospitalName.trim()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                  }`}
              >
                {loading ? "Processing..." : "Submit Request"}
              </button>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Requests</h3>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 p-4 bg-red-50 rounded-lg">
              {error}
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-600 mb-2">You haven't made any requests yet.</p>
              <p className="text-sm text-gray-500">Select an available donation and submit a request to get started.</p>
            </div>
          ) : (
            <ul className="mt-3 space-y-3 max-h-96 overflow-y-auto pr-2">
              {requests.map((request) => {
                // Find the matching donation details
                const matchingDonation = donations.find(d => d.id === request.donationid);
                
                return (
                  <li
                    key={request.id}
                    className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-800">
                            {matchingDonation?.organ || "Organ"} Donation
                          </h4>
                        </div>
                        <p className="text-gray-700">
                          <span className="font-medium">Hospital:</span> {request.nameofthehospital}
                        </p>
                        <p className="text-gray-700 text-sm">
                          <span className="font-medium">Donor Hospital:</span> {matchingDonation?.hospital || "Unknown"}
                        </p>
                        <p className="text-gray-600 text-sm">
                          <span className="font-medium">Date Requested:</span> {new Date().toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(request.donationid, request.id)}
                        className="h-10 bg-red-100 text-red-700 px-4 py-1 rounded-lg text-sm hover:bg-red-600 hover:text-white transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
