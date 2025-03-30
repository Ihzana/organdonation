import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getDonationavailable,insertrecp ,getrecipientlist,deleterecp} from "../api";

export default function RecipientDashboard() {
  const [requests, setRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [hospitalName, setHospitalName] = useState(""); // State for hospital input
  const [selectedDonation, setSelectedDonation] = useState(null); // State for selected donation

  // Fetch available donations
  const location = useLocation();
  const recp = location.state;
  


  console.log(recp)
  const fetchDonations = async () => {
    try {
      const data = await getDonationavailable();
      setDonations(data);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };
  const fetchrecipient = async ()=>{
    try {
        const data = await getrecipientlist(recp.username);
        setRequests(data);
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
  }

  const handleAdd = async (donor_id, name, hospital) => {
    try {
      const response = await insertrecp(donor_id, name, hospital);
      fetchDonations ();
      fetchrecipient();
  
      if (response.status === 201) {
        alert("Recipient added successfully!");
      } else {
        alert("Failed to add recipient. Please try again.");
      }
    } catch (error) {
      console.error("Error adding recipient:", error);
      alert("An error occurred while adding recipient.");
    }
  };


  const handledelete = async (donor_id, id) => {
    try {
      const response = await deleterecp(donor_id, id);
      fetchDonations ();
      fetchrecipient();
  
      if (response.status === 201) {
        alert("Recipient deleted successfully!");
      } else {
        alert("Failed to add recipient. Please try again.");
      }
    } catch (error) {
      console.error("Error adding recipient:", error);
      alert("An error occurred while adding recipient.");
    }
  };




  useEffect(() => {
 fetchDonations();
 fetchrecipient();
  }, []);

  // Handle Delete Request
  const handleDeleteRequest = (id) => {
    setRequests(requests.filter((request) => request.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-green-600 text-white py-4 px-6 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold">Recipient Dashboard</h1>
      </div>

      {/* Donations & Requests List Side by Side */}
      <div className="flex flex-col md:flex-row gap-6 p-6 max-w-6xl mx-auto">
        {/* Available Donations */}
        <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800">Available Donations</h3>
          {donations.length === 0 ? (
            <p className="text-gray-600 mt-2">No donations available.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {donations.map((donation) => (
                <li
                  key={donation.id}
                  className="bg-gray-100 p-3 rounded-lg flex items-center space-x-3"
                >
                  <input
                    type="radio"
                    name="donation"
                    value={donation.id}
                    checked={selectedDonation === donation.id}
                    onChange={() => setSelectedDonation(donation.id)}
                    className="form-radio text-green-600"
                  />
                  <div>
                    <p className="text-gray-700 font-medium">
                      {donation.organ} - {donation.hospital}
                    </p>
                    <p className="text-gray-500 text-sm">{donation.date}</p>
                    <p className="text-gray-500 text-sm">Status: {donation.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Input for Hospital Name */}
          <div className="mt-4">
            <label className="block text-gray-700 font-medium">Enter Hospital Name:</label>
            <input
              type="text"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-green-200"
              placeholder="Type hospital name..."
            />
            <button onClick={()=>{handleAdd(selectedDonation,recp.username,hospitalName)}} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Add to reciepient list
            </button>
          </div>
        </div>

        {/* Requests List */}
        <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800">Your Requests</h3>
          {requests.length === 0 ? (
            <p className="text-gray-600 mt-2">No requests yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {requests.map((request) => (
                <li
                  key={request.id}
                  className="bg-gray-100 p-3 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="text-gray-700 font-medium">
                       {request.nameofthehospital}
                    </p>
                    <p className="text-gray-500 text-sm">{request.name}</p>
                    
                  </div>
                  <button
                    onClick={() => handledelete(request.donationid,request.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

