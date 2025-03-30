import { useState ,useEffect} from "react";
import { useLocation } from "react-router-dom";
import {insertdonor,getMyDonation,deletedonation} from "../api"

export default function DonorDashboard() {
  const [donations, setDonations] = useState([]);
  const [organ, setOrgan] = useState("");
  const [status, setStatus] = useState("Available");
  const [eligibility, setEligibility] = useState({});
  const [hospital, setHospital] = useState("");
  
  const location = useLocation();
  const donor = location.state;
  console.log(donor);

  // Handle Donation Submission

  const getdonation = async()=>{
    const data = await getMyDonation(donor.username);
    setDonations(data);
  }
  const handleAddDonation = async (e) => {
    e.preventDefault();
    if (!organ) return alert("Please select an organ to donate!");
    if (!hospital) return alert("Please enter the hospital name!");
    if (eligibility.age === "No"||eligibility.hiv === "Yes" || eligibility.hepatitis === "Yes" || eligibility.cancer === "Yes" || eligibility.drugs === "Yes" || eligibility.disease === "Yes" || eligibility.transmissible === "Yes") {
      alert("Not eligible for organ donation...!");
    } else {

      const response = await insertdonor(donor.username,organ,hospital,status);
      getdonation(donor.username);
      setOrgan("");
      setHospital("");

    }
  };

  // Handle Delete Donation
  const handleDeleteDonation = async (id) => {
    try {
      await deletedonation(id); // Call API to delete donation
      getdonation();
     
    } catch (error) {
      console.error("Error deleting donation:", error);
    }
  };
  useEffect(()=>{
    getdonation();
  },[])



  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold">Donor Dashboard</h1>
        <p className="text-sm">Welcome, {donor?.username || "Donor"}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 p-6 max-w-6xl mx-auto">
        {/* Eligibility Questions + Add Donation Form */}
        <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Eligibility Questions</h2>
          <form className="space-y-4">
            {[
              { question: "Have you been diagnosed with HIV or AIDS?", key: "hiv", eligible: "No" },
              { question: "Have you been diagnosed with active hepatitis B or C?", key: "hepatitis", eligible: "No" },
              { question: "Do you have active or recent cancer?", key: "cancer", eligible: "No" },
              { question: "Have you used illicit drugs (especially IV drugs) in the past 6 months?", key: "drugs", eligible: "No" },
              { question: "Are you between 18 and 75 years of age?", key: "age", eligible: "Yes" },
              { question: "Do you have advanced heart, lung, kidney, or liver disease?", key: "disease", eligible: "No" },
              { question: "Are you willing to undergo medical testing for donation?", key: "testing", eligible: "Yes" },
              { question: "Have you been diagnosed with any transmissible diseases in the past 12 months?", key: "transmissible", eligible: "No" },
            ].map(({ question, key, eligible }) => (
              <div key={key}>
                <label className="block text-gray-700">{question}</label>
                <select
                  value={eligibility[key] || ""}
                  onChange={(e) => setEligibility({ ...eligibility, [key]: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                >
                  <option value="">Select an option</option>
                  <option value={eligible}>{eligible}</option>
                  <option value={eligible === "Yes" ? "No" : "Yes"}>{eligible === "Yes" ? "No" : "Yes"}</option>
                </select>
              </div>
            ))}
          </form>

          <h2 className="text-2xl font-bold text-gray-800 mt-6">Add Donation</h2>
          <form className="space-y-4" onSubmit={handleAddDonation}>
            <div>
              <label className="block text-gray-700">Select Organ</label>
              <select
                value={organ}
                onChange={(e) => setOrgan(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="">Choose an organ</option>
                <option value="Kidney">Kidney</option>
                <option value="Liver">Liver</option>
                <option value="Heart">Heart</option>
                <option value="Lung">Lung</option>
                <option value="Cornea">Cornea</option>
                <option value="Pancreas">Pancreas</option>
              </select>
            </div>


            <div>
              <label className="block text-gray-700">Select Status</label>
              <select
                value={status}
                onChange={(f) => setStatus(f.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="">Choose an status</option>
                <option value="Available">Available</option>
                <option value="Reserved">Reserved</option>
                <option value="Completed">Completed</option>

              </select>
            </div>



            <div>
              <label className="block text-gray-700">Hospital Name</label>
              <input
                type="text"
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Enter hospital name"
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Add Donation
            </button>
          </form>
        </div>

        {/* Donations List */}
        <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800">Your Donations</h3>
          {donations.length === 0 ? (
            <p className="text-gray-600 mt-2">No donations yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {donations.map((donation) => (
                <li key={donation.id} className="bg-gray-100 p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-gray-700 font-medium">{donation.organ} - {donation.hospital}</p>
                    <p className="text-gray-500 text-sm">{donation.date}</p>
                    <p className="text-gray-500 text-sm">{donation.status}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteDonation(donation.id)}
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
