import { API_BASE_URL } from "./config";
import React, { useState } from "react";
import axios from "axios";

export default function CompleteProfile({ tempUser, onComplete }) {
  const [phone, setPhone] = useState("");
  const [bloodType, setBloodType] = useState("O-");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submitData = async (lat, lng) => {
      try {
        const endpoint =
          tempUser.role === "donor" ? "/api/donors" : "/api/requesters";
        const payload =
          tempUser.role === "donor"
            ? {
                name: tempUser.name,
                contactEmail: tempUser.email,
                contactPhone: phone,
                bloodType: bloodType,
                latitude: lat,
                longitude: lng,
                verificationStatus: "verified",
              }
            : {
                name: tempUser.name,
                contactEmail: tempUser.email,
                contactPhone: phone,
                latitude: lat,
                longitude: lng,
                accountType: "hospital_verified",
              };

        const response = await axios.post(
          `${API_BASE_URL}${endpoint}`,
          payload,
        );
        const newId =
          tempUser.role === "donor"
            ? response.data.donorId
            : response.data.requesterId;
        onComplete(newId, tempUser.role, tempUser.name);
      } catch (err) {
        console.error("Failed to complete profile", err);
        const detail = err.response?.data || err.message;
        alert(
          "Failed to complete profile. Server says: " +
            (typeof detail === "object" ? JSON.stringify(detail) : detail),
        );
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          submitData(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn("Geolocation failed, using default coordinates", error);
          submitData(12.9716, 77.5946); // Default coordinates if user denies
        },
      );
    } else {
      console.warn("Geolocation not supported, using default coordinates");
      submitData(12.9716, 77.5946); // Default coordinates if not supported
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] font-sans flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 border border-zinc-100">
        <h2 className="text-3xl font-extrabold text-zinc-900 text-center mb-2 tracking-tight">
          Almost there
        </h2>
        <p className="text-zinc-500 text-center mb-8 font-medium">
          Welcome, {tempUser.name}! Just a few more details to set up your{" "}
          <span className="font-bold text-zinc-800">{tempUser.role}</span>{" "}
          account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-2 pl-1">
              Contact Phone
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-2xl bg-zinc-50 border-transparent shadow-sm p-4 text-zinc-900 font-bold focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 focus:bg-white outline-none transition-all"
            />
          </div>

          {tempUser.role === "donor" && (
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2 pl-1">
                Blood Type
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
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-extrabold text-white text-lg transition-all shadow-xl mt-4 ${
              loading
                ? "bg-zinc-400 cursor-not-allowed"
                : "bg-rose-500 hover:bg-rose-600 shadow-rose-500/30 hover:shadow-rose-500/50 transform hover:-translate-y-1"
            }`}
          >
            {loading ? "Saving..." : "Finish Registration"}
          </button>
        </form>
      </div>
    </div>
  );
}
