import { API_BASE_URL } from './config';
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";

// Fix Leaflet marker icon issue
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapView = ({ onAccept, onDecline }) => {
  const [requests, setRequests] = useState([]);
  const [userPos, setUserPos] = useState(null);

  useEffect(() => {
    // Request user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPos([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting location", error);
          // Fallback to default
          setUserPos([12.9716, 77.5946]);
        },
      );
    } else {
      setUserPos([12.9716, 77.5946]);
    }

    const fetchRequests = () => {
      axios
        .get(`${API_BASE_URL}/api/requests/active`)
        .then((res) => setRequests(res.data))
        .catch((err) => console.error("Error fetching active requests", err));
    };

    fetchRequests();
    const interval = setInterval(fetchRequests, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleDeclineLocal = (requestId) => {
    setRequests((prev) => prev.filter((r) => r.requestId !== requestId));
    if (onDecline) {
      onDecline(requestId);
    }
  };

  const handleAcceptLocal = (requestId) => {
    setRequests((prev) => prev.filter((r) => r.requestId !== requestId));
    if (onAccept) {
      onAccept(requestId);
    }
  };

  // Show a loading state until we have either the user's location or the fallback
  if (!userPos) {
    return (
      <div className="bg-white p-10 rounded-[32px] shadow flex flex-col items-center justify-center h-[400px]">
        <div className="w-12 h-12 border-4 border-zinc-200 border-t-rose-500 rounded-full animate-spin mb-4"></div>
        <p className="text-zinc-500 font-medium">Acquiring radar lock...</p>
      </div>
    );
  }

  // Custom icon for user location
  const userIcon = L.divIcon({
    className: "custom-user-icon",
    html: `<div style="width: 20px; height: 20px; background-color: #3b82f6; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  return (
    <div className="h-full w-full relative">
      <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-white/20">
        <h2 className="text-sm font-extrabold text-zinc-900">Live Radar</h2>
      </div>
      <div style={{ height: "400px", width: "100%" }}>
        <MapContainer
          center={userPos}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {/* User Location Marker */}
          <Marker position={userPos} icon={userIcon}>
            <Popup>
              <strong>You are here</strong>
            </Popup>
          </Marker>

          {requests.map((req) =>
            req.latitude && req.longitude ? (
              <Marker
                key={req.requestId}
                position={[req.latitude, req.longitude]}
              >
                <Popup>
                  <div className="text-center min-w-[150px]">
                    <strong className="text-rose-600 block text-lg mb-1">
                      {req.bloodTypeNeeded} needed!
                    </strong>
                    <span className="text-xs font-bold bg-rose-100 text-rose-700 px-2 py-1 rounded-full mb-2 inline-block uppercase">
                      {req.urgencyLevel}
                    </span>
                    <p className="text-zinc-600 text-sm font-medium mt-1 mb-4">
                      Units: {req.unitsNeeded}
                    </p>
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleAcceptLocal(req.requestId)}
                        className="flex-1 bg-lime-400 hover:bg-lime-500 text-black font-bold text-xs py-2 px-2 rounded-lg transition shadow-sm"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleDeclineLocal(req.requestId)}
                        className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 font-bold text-xs py-2 px-2 rounded-lg transition"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ) : null,
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;
