import { API_BASE_URL } from './config';
import { useState, useEffect } from "react";
import axios from "axios";
import HospitalDashboard from "./HospitalDashboard";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom icon
const locationIcon = L.divIcon({
  className: "custom-location-icon",
  html: `<div style="width: 24px; height: 24px; background-color: #f43f5e; border-radius: 50%; border: 4px solid white; box-shadow: 0 0 15px rgba(244, 63, 94, 0.6); animation: pulse 2s infinite;"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export default function SubmitRequest({ requesterId }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeRequestId, setActiveRequestId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [bloodType, setBloodType] = useState("O-");
  const [units, setUnits] = useState(2);
  const [urgency, setUrgency] = useState("urgent");
  const [location, setLocation] = useState("City General Hospital");

  // Geolocation state
  const [pos, setPos] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPos([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.warn("Geolocation failed", error);
          setPos([12.9716, 77.5946]); // fallback
        },
      );
    } else {
      setPos([12.9716, 77.5946]); // fallback
    }
  }, []);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPos([e.latlng.lat, e.latlng.lng]);
      },
    });

    return pos === null ? null : (
      <Marker position={pos} icon={locationIcon}>
        <Popup>SOS Broadcast Location</Popup>
      </Marker>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/requests`, {
        requester: { requesterId: requesterId }, // Links to the logged-in hospital[cite: 3]
        bloodTypeNeeded: bloodType,
        unitsNeeded: parseInt(units),
        location: location,
        urgencyLevel: urgency,
        latitude: pos ? pos[0] : 12.9716,
        longitude: pos ? pos[1] : 77.5946,
      });

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
      <div className="animate-fade-in w-full">
        <button
          onClick={() => setIsSubmitted(false)}
          className="mb-8 text-zinc-500 hover:text-zinc-900 font-bold transition flex items-center"
        >
          <span className="mr-2">←</span> Submit Another Request
        </button>
        <HospitalDashboard
          requesterId={requesterId}
          initialRequestId={activeRequestId}
          hospitalName={HospitalDashboard.hospitalName || "Hospital"}
        />
      </div>
    );
  }

  // Otherwise, show the professional submission form
  return (
    <div className="w-full max-w-5xl mx-auto mt-10">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-zinc-900 tracking-tight">
          Broadcast SOS
        </h2>
        <p className="text-zinc-500 font-medium mt-2">
          Alert eligible donors within a 10km radius instantly.
        </p>
      </div>

      <div className="bg-white rounded-[32px] shadow-xl shadow-zinc-200/50 p-10 border border-zinc-100 flex flex-col lg:flex-row gap-10">
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2 pl-2">
                  Blood Type Needed
                </label>
                <select
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="w-full rounded-2xl bg-zinc-50 border-transparent shadow-sm p-4 text-zinc-900 font-bold focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 focus:bg-white outline-none transition-all cursor-pointer"
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
                <label className="block text-sm font-bold text-zinc-700 mb-2 pl-2">
                  Units Required
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={units}
                  onChange={(e) => setUnits(e.target.value)}
                  className="w-full rounded-2xl bg-zinc-50 border-transparent shadow-sm p-4 text-zinc-900 font-bold focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 focus:bg-white outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-3 pl-2">
                Urgency Level
              </label>
              <div className="flex space-x-4">
                <label
                  className={`flex-1 flex items-center justify-center space-x-2 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    urgency === "urgent"
                      ? "border-rose-500 bg-rose-50 text-rose-700"
                      : "border-zinc-100 bg-zinc-50 text-zinc-500 hover:bg-zinc-100"
                  }`}
                >
                  <input
                    type="radio"
                    name="urgency"
                    value="urgent"
                    checked={urgency === "urgent"}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="hidden"
                  />
                  <span className="font-extrabold uppercase tracking-wider text-sm">
                    Critical SOS
                  </span>
                </label>
                <label
                  className={`flex-1 flex items-center justify-center space-x-2 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    urgency === "standard"
                      ? "border-lime-400 bg-lime-50 text-lime-700"
                      : "border-zinc-100 bg-zinc-50 text-zinc-500 hover:bg-zinc-100"
                  }`}
                >
                  <input
                    type="radio"
                    name="urgency"
                    value="standard"
                    checked={urgency === "standard"}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="hidden"
                  />
                  <span className="font-extrabold uppercase tracking-wider text-sm">
                    Standard
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2 pl-2">
                Facility Name
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-2xl bg-zinc-50 border-transparent shadow-sm p-4 text-zinc-900 font-bold focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 focus:bg-white outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !pos}
              className={`w-full py-5 rounded-2xl font-extrabold text-white text-lg transition-all shadow-xl mt-4 ${
                loading || !pos
                  ? "bg-zinc-400 cursor-not-allowed"
                  : "bg-rose-500 hover:bg-rose-600 shadow-rose-500/30 hover:shadow-rose-500/50 transform hover:-translate-y-1"
              }`}
            >
              {loading || !pos
                ? "Acquiring coordinates..."
                : "Broadcast SOS Alert"}
            </button>
          </form>
        </div>

        <div className="flex-1 flex flex-col space-y-3">
          <label className="block text-sm font-bold text-zinc-700 pl-2">
            Dispatch Location
          </label>
          <div className="flex-1 min-h-[300px] rounded-[24px] overflow-hidden border-4 border-zinc-50 shadow-inner relative">
            {pos ? (
              <MapContainer
                center={pos}
                zoom={14}
                style={{ height: "100%", width: "100%", zIndex: 1 }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <LocationMarker />
              </MapContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 text-zinc-400 font-medium">
                <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-400 rounded-full animate-spin mb-4"></div>
                Locating your facility...
              </div>
            )}
            <div className="absolute bottom-4 left-4 right-4 z-[400] bg-white/90 backdrop-blur text-xs font-bold text-zinc-600 px-4 py-3 rounded-xl shadow-md text-center">
              You can tap the map to adjust the precise dispatch coordinates.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
