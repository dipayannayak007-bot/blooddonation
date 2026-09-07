import { useState } from "react";
import axios from "axios";
import HospitalDashboard from "./HospitalDashboard";

export default function SubmitRequest({ requesterId, onBack }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeRequestId, setActiveRequestId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [bloodType, setBloodType] = useState("O-");
  const [units, setUnits] = useState(2);
  const [urgency, setUrgency] = useState("urgent");
  const [location, setLocation] = useState("City General Hospital");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "https://pulsenode-backend.onrender.com/api/requests",
        {
          requester: { requesterId: requesterId }, // Links to the logged-in hospital[cite: 3]
          bloodTypeNeeded: bloodType,
          unitsNeeded: parseInt(units),
          location: location,
          urgencyLevel: urgency,
          latitude: 12.9716, // Hardcoded coordinates for the prototype's 10km radius logic
          longitude: 77.5946,
        },
      );

      // Capture the new request ID and transition to the live dashboard
      setActiveRequestId(response.data.requestId);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error creating request:", error);
      alert("Failed to broadcast SOS. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // If successfully submitted, immediately show the live tracking dashboard
  if (isSubmitted) {
    return (
      <div className="animate-fade-in">
        <button
          onClick={() => setIsSubmitted(false)}
          className="mb-4 text-blue-600 hover:underline font-medium"
        >
          ← Submit Another Request
        </button>
        <HospitalDashboard
          requesterId={requesterId}
          initialRequestId={activeRequestId}
        />
      </div>
    );
  }

  // Otherwise, show the professional submission form
  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <div className="bg-blue-600 p-6 text-white relative">
        {onBack && (
          <button
            onClick={onBack}
            className="absolute top-4 left-4 text-blue-200 hover:text-white"
          >
            ← Back
          </button>
        )}
        <h2 className="text-2xl font-bold text-center mt-2">
          Create Blood Request
        </h2>
        <p className="text-blue-100 text-center text-sm mt-1">
          Broadcast an emergency alert to eligible nearby donors.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Blood Type Needed
            </label>
            <select
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm p-2.5 border focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option>O-</option>
              <option>O+</option>
              <option>A-</option>
              <option>A+</option>
              <option>B-</option>
              <option>B+</option>
              <option>AB-</option>
              <option>AB+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Units Required
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm p-2.5 border focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Urgency Level
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="urgency"
                value="urgent"
                checked={urgency === "urgent"}
                onChange={(e) => setUrgency(e.target.value)}
                className="text-blue-600"
              />
              <span className="text-red-600 font-bold">Urgent (SOS)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="urgency"
                value="standard"
                checked={urgency === "standard"}
                onChange={(e) => setUrgency(e.target.value)}
                className="text-blue-600"
              />
              <span className="text-gray-700">Standard</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm p-2.5 border focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold text-white transition shadow-md mt-4 ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Broadcasting..." : "Broadcast SOS Alert"}
        </button>
      </form>
    </div>
  );
}
