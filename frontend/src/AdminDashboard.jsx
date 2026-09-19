import { API_BASE_URL } from './config';
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard({ activeTab }) {
  const [stats, setStats] = useState(null);
  const [donors, setDonors] = useState([]);
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    if (activeTab === "dashboard" || !activeTab) {
      axios
        .get(`${API_BASE_URL}/api/analytics/admin`)
        .then((res) => setStats(res.data))
        .catch((err) => console.error("Failed to fetch admin stats", err));
    } else if (activeTab === "donors") {
      axios
        .get(`${API_BASE_URL}/api/donors`)
        .then((res) => setDonors(res.data))
        .catch((err) => console.error("Failed to fetch donors", err));
    } else if (activeTab === "hospitals") {
      axios
        .get(`${API_BASE_URL}/api/requesters`)
        .then((res) => setHospitals(res.data))
        .catch((err) => console.error("Failed to fetch hospitals", err));
    }
  }, [activeTab]);

  // Get today's date formatted
  const today = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (activeTab === "donors") {
    return (
      <div className="w-full space-y-6">
        <header className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight">
              Donors List
            </h1>
            <p className="text-zinc-500 font-medium mt-1">
              Manage all registered donors.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 md:space-x-4">
            <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-zinc-100 font-bold text-zinc-600 text-sm">
              {today}
            </div>
          </div>
        </header>

        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-zinc-100 min-h-[600px]">
          <div className="space-y-4">
            {donors.map((donor) => (
              <div
                key={donor.donorId}
                className="flex justify-between items-center p-6 border border-zinc-100 rounded-2xl hover:bg-zinc-50 transition"
              >
                <div>
                  <h3 className="font-bold text-zinc-900 text-lg">
                    {donor.name}
                  </h3>
                  <p className="text-sm font-medium text-zinc-500">
                    {donor.contactEmail}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 md:space-x-4">
                  <span className="text-rose-600 font-extrabold bg-rose-50 px-3 py-1 rounded-lg">
                    {donor.bloodType || "N/A"}
                  </span>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-lg ${donor.verificationStatus === "verified" ? "bg-lime-100 text-lime-700" : "bg-orange-100 text-orange-600"}`}
                  >
                    {donor.verificationStatus?.toUpperCase() || "PENDING"}
                  </span>
                </div>
              </div>
            ))}
            {donors.length === 0 && (
              <p className="text-center text-zinc-500 font-medium py-10">
                No donors found.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === "hospitals") {
    return (
      <div className="w-full space-y-6">
        <header className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight">
              Hospitals List
            </h1>
            <p className="text-zinc-500 font-medium mt-1">
              Manage all registered hospitals.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 md:space-x-4">
            <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-zinc-100 font-bold text-zinc-600 text-sm">
              {today}
            </div>
          </div>
        </header>

        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-zinc-100 min-h-[600px]">
          <div className="space-y-4">
            {hospitals.map((hospital) => (
              <div
                key={hospital.requesterId}
                className="flex justify-between items-center p-6 border border-zinc-100 rounded-2xl hover:bg-zinc-50 transition"
              >
                <div>
                  <h3 className="font-bold text-zinc-900 text-lg">
                    {hospital.name || "Unnamed"}
                  </h3>
                  <p className="text-sm font-medium text-zinc-500">
                    {hospital.contactEmail || "No Email"}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 md:space-x-4">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-lg ${hospital.verificationStatus === "verified" ? "bg-lime-100 text-lime-700" : "bg-orange-100 text-orange-600"}`}
                  >
                    {hospital.verificationStatus?.toUpperCase() || "PENDING"}
                  </span>
                </div>
              </div>
            ))}
            {hospitals.length === 0 && (
              <p className="text-center text-zinc-500 font-medium py-10">
                No hospitals found.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight">
            Admin Console
          </h1>
          <p className="text-zinc-500 font-medium mt-1">
            Platform analytics and ecosystem health.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 md:space-x-4">
          <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-zinc-100 font-bold text-zinc-600 text-sm">
            {today}
          </div>
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-zinc-100">
            <div className="w-2.5 h-2.5 rounded-full bg-lime-400 animate-pulse"></div>
            <span className="text-sm font-bold text-zinc-700">
              System Online
            </span>
          </div>
        </div>
      </header>

      {stats ? (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-[#151515] text-white p-8 rounded-[32px] shadow-xl relative overflow-hidden group">
                <h3 className="text-zinc-400 font-bold text-sm mb-4">
                  Total Donors
                </h3>
                <p className="text-6xl font-extrabold tracking-tighter relative z-10">
                  {stats.totalDonors}
                </p>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-lime-400/20 rounded-full blur-3xl group-hover:bg-lime-400/30 transition-all"></div>
              </div>

              <div className="bg-[#151515] text-white p-8 rounded-[32px] shadow-xl relative overflow-hidden group">
                <h3 className="text-zinc-400 font-bold text-sm mb-4">
                  Active Verified
                </h3>
                <p className="text-6xl font-extrabold tracking-tighter relative z-10">
                  {stats.activeDonors}
                </p>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-rose-500/20 rounded-full blur-3xl group-hover:bg-rose-500/30 transition-all"></div>
              </div>

              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-zinc-100 col-span-1 sm:col-span-2 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-6 sm:space-y-0 group relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-zinc-500 font-bold text-sm mb-2">
                    Platform Success Rate
                  </h3>
                  <div className="flex items-end space-x-2">
                    <p className="text-7xl font-extrabold text-zinc-900 tracking-tighter">
                      {stats.totalRequests
                        ? Math.round(
                            (stats.fulfilledRequests / stats.totalRequests) *
                              100,
                          )
                        : 0}
                    </p>
                    <span className="text-3xl font-bold text-zinc-400 pb-2">
                      %
                    </span>
                  </div>
                </div>
                <div className="text-right relative z-10">
                  <p className="text-sm font-bold text-zinc-400 mb-1">
                    Total Completed Donations
                  </p>
                  <p className="text-3xl font-extrabold text-zinc-800">
                    {stats.totalCompletedDonations}
                  </p>
                </div>
                <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-lime-400/10 rounded-full blur-3xl group-hover:bg-lime-400/20 transition-all"></div>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-zinc-100 h-full flex flex-col justify-center relative overflow-hidden group">
              <h3 className="text-zinc-500 font-bold text-sm mb-4 relative z-10">
                Avg Response Time
              </h3>
              <div className="flex items-end space-x-2 relative z-10">
                <p className="text-6xl font-extrabold text-zinc-900 tracking-tighter">
                  {stats.avgResponseTimeMins}
                </p>
                <p className="text-xl font-bold text-zinc-400 pb-1">mins</p>
              </div>
              <p className="text-xs font-bold text-lime-600 bg-lime-100 w-max px-3 py-1 rounded-lg mt-4 relative z-10">
                Highly Efficient
              </p>

              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl group-hover:bg-blue-400/20 transition-all"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
