import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { insertdonor, getMyDonation, deletedonation } from "../api";

export default function DonorDashboard() {
  const [donations, setDonations] = useState([]);
  const [organ, setOrgan] = useState("");
  const [status, setStatus] = useState("Available");
  const [eligibility, setEligibility] = useState({});
  const [hospital, setHospital] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [allergies, setAllergies] = useState("");
  const [currentMedications, setCurrentMedications] = useState("");
  const [emergencyContact, setEmergencyContact] = useState({
    name: "",
    phone: "",
    relationship: ""
  });
  const [donationConsent, setDonationConsent] = useState(false);
  const [showMedicalInfo, setShowMedicalInfo] = useState(false);
  const [showEmergencyInfo, setShowEmergencyInfo] = useState(false);
  
  const location = useLocation();
  const donor = location.state;
  console.log(donor);

  // Handle Donation Submission
  const getdonation = async() => {
    const data = await getMyDonation(donor.username);
    setDonations(data);
  }
  
  const handleAddDonation = async (e) => {
    e.preventDefault();
    if (!organ) return alert("Please select an organ to donate!");
    if (!hospital) return alert("Please enter the hospital name!");
    if (!bloodType) return alert("Please select your blood type!");
    if (!donationConsent) return alert("You must provide consent for organ donation!");
    
    if (eligibility.age === "No"||eligibility.hiv === "Yes" || eligibility.hepatitis === "Yes" || eligibility.cancer === "Yes" || eligibility.drugs === "Yes" || eligibility.disease === "Yes" || eligibility.transmissible === "Yes") {
      alert("Not eligible for organ donation...!");
    } else {
      // Updated to include additional donor information
      const donorDetails = {
        username: donor.username,
        organ,
        hospital,
        status,
        bloodType,
        medicalHistory,
        allergies,
        currentMedications,
        emergencyContact: emergencyContact.name ? emergencyContact : null,
        donationConsent
      };
      
      const response = await insertdonor(donorDetails);
      getdonation();
      resetForm();
    }
  };

  const resetForm = () => {
    setOrgan("");
    setHospital("");
    setBloodType("");
    setMedicalHistory("");
    setAllergies("");
    setCurrentMedications("");
    setEmergencyContact({ name: "", phone: "", relationship: "" });
    setDonationConsent(false);
  };

  // Handle Delete Donation
  const handleDeleteDonation = async (id) => {
    try {
      await deletedonation(id);
      getdonation();
    } catch (error) {
      console.error("Error deleting donation:", error);
    }
  };
  
  useEffect(() => {
    getdonation();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold">Organ Donor Dashboard</h1>
        <p className="text-sm">Welcome, {donor?.username || "Donor"}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 p-6 max-w-6xl mx-auto">
        {/* Eligibility Questions + Add Donation Form */}
        <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-lg overflow-auto max-h-screen">
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
                <option value="Bone Marrow">Bone Marrow</option>
                <option value="Small Intestine">Small Intestine</option>
                <option value="Tissue">Tissue</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700">Blood Type</label>
              <select
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="">Select your blood type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700">Select Status</label>
              <select
                value={status}
                onChange={(f) => setStatus(f.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
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

            {/* Collapsible Medical History Section */}
            <div>
              <button 
                type="button" 
                onClick={() => setShowMedicalInfo(!showMedicalInfo)}
                className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 flex justify-between items-center px-4"
              >
                <span>Medical Information</span>
                <span>{showMedicalInfo ? "▲" : "▼"}</span>
              </button>
              
              {showMedicalInfo && (
                <div className="mt-2 space-y-3 p-3 border border-gray-200 rounded-lg">
                  <div>
                    <label className="block text-gray-700">Medical History</label>
                    <textarea
                      value={medicalHistory}
                      onChange={(e) => setMedicalHistory(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      placeholder="List any significant medical conditions or surgeries"
                      rows="3"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-gray-700">Allergies</label>
                    <textarea
                      value={allergies}
                      onChange={(e) => setAllergies(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      placeholder="List any allergies to medications or substances"
                      rows="2"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-gray-700">Current Medications</label>
                    <textarea
                      value={currentMedications}
                      onChange={(e) => setCurrentMedications(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      placeholder="List any current medications you are taking"
                      rows="2"
                    ></textarea>
                  </div>
                </div>
              )}
            </div>

            {/* Collapsible Emergency Contact Section */}
            <div>
              <button 
                type="button" 
                onClick={() => setShowEmergencyInfo(!showEmergencyInfo)}
                className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 flex justify-between items-center px-4"
              >
                <span>Emergency Contact</span>
                <span>{showEmergencyInfo ? "▲" : "▼"}</span>
              </button>
              
              {showEmergencyInfo && (
                <div className="mt-2 space-y-3 p-3 border border-gray-200 rounded-lg">
                  <div>
                    <label className="block text-gray-700">Contact Name</label>
                    <input
                      type="text"
                      value={emergencyContact.name}
                      onChange={(e) => setEmergencyContact({...emergencyContact, name: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Contact Phone</label>
                    <input
                      type="tel"
                      value={emergencyContact.phone}
                      onChange={(e) => setEmergencyContact({...emergencyContact, phone: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      placeholder="Phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Relationship</label>
                    <input
                      type="text"
                      value={emergencyContact.relationship}
                      onChange={(e) => setEmergencyContact({...emergencyContact, relationship: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      placeholder="Relationship to you"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Donation Consent */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="consent"
                checked={donationConsent}
                onChange={(e) => setDonationConsent(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="consent" className="ml-2 block text-sm text-gray-700">
                I consent to donate my organs and understand the process and potential risks involved
              </label>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Add Donation
            </button>
          </form>
        </div>

        {/* Donations List and Additional Resources */}
        <div className="md:w-1/2 space-y-6">
          {/* Donations List */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800">Your Donations</h3>
            {donations.length === 0 ? (
              <p className="text-gray-600 mt-2">No donations yet.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {donations.map((donation) => (
                  <li key={donation.id} className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-700 font-medium">{donation.organ} - {donation.hospital}</p>
                        <p className="text-gray-500 text-sm">Blood Type: {donation.bloodType}</p>
                        <p className="text-gray-500 text-sm">{donation.date}</p>
                        <div className="mt-1 inline-block px-2 py-1 rounded-full text-xs font-semibold" 
                          style={{
                            backgroundColor: 
                              donation.status === "Available" ? "#d1fae5" : 
                              donation.status === "Reserved" ? "#ffe4e6" : "#e0f2fe",
                            color: 
                              donation.status === "Available" ? "#065f46" : 
                              donation.status === "Reserved" ? "#be123c" : "#0369a1"
                          }}>
                          {donation.status}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteDonation(donation.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Donation Process Timeline */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Donation Process</h3>
            <div className="relative border-l-2 border-blue-500 ml-4">
              {[
                { title: "Registration", desc: "Complete your donor profile and eligibility screening" },
                { title: "Medical Evaluation", desc: "Undergo necessary medical tests and examinations" },
                { title: "Matching", desc: "Await matching with a compatible recipient" },
                { title: "Pre-Surgery Preparation", desc: "Final medical checks and preparation" },
                { title: "Donation Procedure", desc: "The actual organ donation surgery" },
                { title: "Recovery", desc: "Post-donation recovery and follow-up care" }
              ].map((step, index) => (
                <div key={index} className="mb-6 ml-6">
                  <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white text-blue-600 font-bold">
                    {index + 1}
                  </span>
                  <h3 className="font-medium text-gray-900">{step.title}</h3>
                  <p className="text-sm text-gray-500">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Educational Resources */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Educational Resources</h3>
            <ul className="space-y-2">
              <li className="p-2 hover:bg-blue-50 rounded-lg">
                <a href="#" className="flex items-center text-blue-600">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path>
                  </svg>
                  Understanding Organ Donation: Complete Guide
                </a>
              </li>
              <li className="p-2 hover:bg-blue-50 rounded-lg">
                <a href="#" className="flex items-center text-blue-600">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                  </svg>
                  Frequently Asked Questions
                </a>
              </li>
              <li className="p-2 hover:bg-blue-50 rounded-lg">
                <a href="#" className="flex items-center text-blue-600">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
                  </svg>
                  Video: Life After Donation
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
