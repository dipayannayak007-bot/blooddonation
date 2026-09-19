import { API_BASE_URL } from "./config";
import { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
import MapView from "./Map";

export default function DonorDashboard({ donorId, donorName, activeTab }) {
  const [alerts, setAlerts] = useState([]);
  const [connected, setConnected] = useState(false);
  const [donorDetails, setDonorDetails] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Fetch donor details
    axios
      .get(`${API_BASE_URL}/api/donors/${donorId}`)
      .then((res) => setDonorDetails(res.data))
      .catch((err) => console.error("Failed to fetch donor details", err));

    // Fetch history
    axios
      .get(`${API_BASE_URL}/api/donors/${donorId}/history`)
      .then((res) => setHistory(res.data))
      .catch((err) => console.error("Failed to fetch history", err));

    const socket = new SockJS(`${API_BASE_URL}/ws-blood-donation`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        setConnected(true);
        stompClient.subscribe(`/topic/alerts/${donorId}`, (message) => {
          const newAlert = JSON.parse(message.body);
          setAlerts((prev) => [...prev, newAlert]);
        });
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
      },
    });

    stompClient.activate();

    return () => {
      if (stompClient) stompClient.deactivate();
    };
  }, [donorId]);

  const handleAccept = async (requestId) => {
    try {
      await axios.post(`${API_BASE_URL}/api/requests/${requestId}/responses`, {
        donorId: donorId,
        answer: "accept",
      });
      setAlerts(alerts.filter((alert) => alert.requestId !== requestId));
      alert("Thank you! The hospital has been notified of your response.");
    } catch (error) {
      console.error("Failed to send response", error);
    }
  };

  const getNextEligibleDate = (lastDonationDate) => {
    if (!lastDonationDate) return "Eligible Now";
    const date = new Date(lastDonationDate);
    date.setDate(date.getDate() + 56); // 56 days cooldown
    if (date < new Date()) return "Eligible Now";
    return date.toLocaleDateString();
  };

  // Get today's date formatted
  const today = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const renderHeader = (title, subtitle) => (
    <header className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 space-y-4 md:space-y-0">
      <div>
        <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tighter mb-2">
          {title}
        </h1>
        <p className="text-zinc-500 font-medium">{subtitle}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3 md:space-x-4">
        <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-zinc-100 text-sm font-bold text-zinc-600">
          {today}
        </div>
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-zinc-100">
          <div
            className={`w-2.5 h-2.5 rounded-full ${connected ? "bg-lime-400" : "bg-rose-500"} animate-pulse`}
          ></div>
          <span className="text-sm font-bold text-zinc-700">
            {connected ? "Radar Active" : "Disconnected"}
          </span>
        </div>
      </div>
    </header>
  );

  if (activeTab === "history") {
    return (
      <div className="w-full space-y-6">
        {renderHeader("Donation History", "Your lifesaving journey in detail.")}
        <div className="bg-white rounded-[32px] p-10 shadow-sm border border-zinc-100 min-h-[600px]">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl opacity-50">📜</span>
              </div>
              <h3 className="text-xl font-bold text-zinc-700 mb-2">
                No history yet
              </h3>
              <p className="text-zinc-500 font-medium">
                Your donation records will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((record) => (
                <div
                  key={record.recordId}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-3xl hover:bg-zinc-50 transition border border-zinc-100 space-y-4 md:space-y-0"
                >
                  <div className="flex items-center space-x-4 md:space-x-6">
                    <div className="w-14 h-14 shrink-0 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center font-extrabold text-xl">
                      {record.request.bloodTypeNeeded}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-zinc-900 text-lg leading-tight">
                        Hospital Request #{record.request.requestId}
                      </h4>
                      <p className="text-zinc-500 font-medium text-sm mt-1">
                        Successfully completed donation
                      </p>
                    </div>
                  </div>
                  <div className="text-left md:text-right w-full md:w-auto mt-2 md:mt-0">
                    <span className="text-sm font-bold bg-zinc-100 text-zinc-600 px-4 py-2 rounded-xl inline-block">
                      {new Date(record.donationDate).toLocaleDateString(
                        undefined,
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === "rewards") {
    return (
      <div className="w-full space-y-6">
        {renderHeader("Your Rewards", "Unlock perks for saving lives.")}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div
            className={`p-8 rounded-[32px] border-2 shadow-sm relative overflow-hidden transition-all ${donorDetails?.rewardTier === "Bronze" || donorDetails?.rewardTier === "Silver" || donorDetails?.rewardTier === "Gold" ? "border-[#cd7f32] bg-orange-50" : "border-zinc-100 bg-white opacity-50"}`}
          >
            <h3 className="text-[#cd7f32] font-extrabold text-2xl mb-2">
              Bronze Tier
            </h3>
            <p className="text-[#cd7f32]/80 font-medium mb-6">1+ Donations</p>
            <ul className="space-y-3 font-medium text-zinc-700">
              <li>✓ Digital Badge</li>
              <li>✓ Priority Support</li>
            </ul>
          </div>
          <div
            className={`p-8 rounded-[32px] border-2 shadow-sm relative overflow-hidden transition-all ${donorDetails?.rewardTier === "Silver" || donorDetails?.rewardTier === "Gold" ? "border-zinc-400 bg-zinc-50" : "border-zinc-100 bg-white opacity-50"}`}
          >
            <h3 className="text-zinc-600 font-extrabold text-2xl mb-2">
              Silver Tier
            </h3>
            <p className="text-zinc-500 font-medium mb-6">3+ Donations</p>
            <ul className="space-y-3 font-medium text-zinc-700">
              <li>✓ Free Health Checkup</li>
              <li>✓ Exclusive Merch</li>
            </ul>
          </div>
          <div
            className={`p-8 rounded-[32px] border-2 shadow-sm relative overflow-hidden transition-all ${donorDetails?.rewardTier === "Gold" ? "border-amber-400 bg-amber-50" : "border-zinc-100 bg-white opacity-50"}`}
          >
            <h3 className="text-amber-600 font-extrabold text-2xl mb-2">
              Gold Tier
            </h3>
            <p className="text-amber-600/80 font-medium mb-6">5+ Donations</p>
            <ul className="space-y-3 font-medium text-zinc-700">
              <li>✓ Premium Health Insurance Discount</li>
              <li>✓ Gala Dinner Invite</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {renderHeader("Donor Overview", "Take control of your impact today!")}

      <div className="grid grid-cols-12 gap-6">
        {/* Main Stats Block */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-zinc-100 relative overflow-hidden group">
              <h3 className="text-zinc-500 font-bold mb-4 flex justify-between items-center">
                <span>Total Donations</span>
                <span className="text-xs bg-lime-100 text-lime-700 px-2 py-1 rounded-full">
                  +1
                </span>
              </h3>
              <div className="flex items-end space-x-2">
                <span className="text-6xl font-extrabold text-zinc-900 tracking-tighter">
                  {donorDetails?.donationCount || 0}
                </span>
                <span className="text-zinc-400 font-medium pb-2">
                  lifesaves
                </span>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-lime-400/20 rounded-full blur-3xl group-hover:bg-lime-400/30 transition-all"></div>
            </div>

            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-zinc-100 relative overflow-hidden group">
              <h3 className="text-zinc-500 font-bold mb-4 flex justify-between items-center">
                <span>Reward Tier</span>
                <span className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-full">
                  Current
                </span>
              </h3>
              <div className="flex items-end space-x-2">
                <span className="text-5xl font-extrabold text-zinc-900 tracking-tighter">
                  {donorDetails?.rewardTier || "None"}
                </span>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl group-hover:bg-rose-500/20 transition-all"></div>
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-zinc-100">
            <h3 className="text-xl font-extrabold text-zinc-900 mb-6">
              Active Emergencies
            </h3>
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl opacity-50">📡</span>
                </div>
                <p className="text-zinc-500 font-medium">
                  Radar is quiet. No active requests in your area.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert, index) => (
                  <div
                    key={alert.requestId}
                    className="bg-rose-50 border border-rose-100 p-4 md:p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0"
                  >
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="bg-rose-500 text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
                          {alert.urgency}
                        </span>
                        <h4 className="text-rose-900 font-extrabold text-base md:text-lg">
                          {alert.message}
                        </h4>
                      </div>
                      <p className="text-rose-700 font-medium text-xs md:text-sm">
                        Requested Type:{" "}
                        <span className="font-extrabold text-rose-900">
                          {alert.bloodType}
                        </span>
                      </p>
                    </div>
                    <div className="flex w-full md:w-auto space-x-2 md:space-x-3">
                      <button
                        onClick={() => handleAccept(alert.requestId)}
                        className="flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 bg-rose-500 text-white rounded-xl md:rounded-2xl font-bold text-xs md:text-base hover:bg-rose-600 transition shadow-lg shadow-rose-500/30"
                      >
                        I Can Donate
                      </button>
                      <button
                        onClick={() =>
                          setAlerts(
                            alerts.filter(
                              (a) => a.requestId !== alert.requestId,
                            ),
                          )
                        }
                        className="flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 bg-white text-rose-500 rounded-xl md:rounded-2xl font-bold text-xs md:text-base hover:bg-rose-50 transition border border-rose-200"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Live Radar */}
          <div className="col-span-12">
            <div className="overflow-hidden rounded-[32px] shadow-sm border border-zinc-100">
              <MapView
                onAccept={handleAccept}
                onDecline={(requestId) =>
                  setAlerts(alerts.filter((a) => a.requestId !== requestId))
                }
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-[#151515] rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-zinc-400 font-bold mb-6 flex justify-between items-center">
                <span>Next Eligible Date</span>
                <span className="bg-zinc-800 p-2 rounded-xl text-xs">
                  Cooldown
                </span>
              </h3>

              <div className="mb-8">
                <div className="text-4xl font-extrabold tracking-tight mb-2">
                  {donorDetails
                    ? getNextEligibleDate(donorDetails.lastDonationDate)
                    : "Loading..."}
                </div>
                <p className="text-sm text-zinc-400 font-medium">
                  {donorDetails?.lastDonationDate
                    ? "Recovery period active"
                    : "You are fully recovered!"}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-zinc-400 mb-2">
                    <span>Iron Levels</span>
                    <span className="text-lime-400">Optimal</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-2">
                    <div className="bg-lime-400 h-2 rounded-full w-4/5"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-zinc-400 mb-2">
                    <span>Hydration</span>
                    <span className="text-lime-400">95%</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-2">
                    <div className="bg-lime-400 h-2 rounded-full w-[95%]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dark card decorations */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/10 rounded-full blur-3xl"></div>
          </div>

          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-zinc-100 h-[400px] overflow-y-auto">
            <h3 className="text-xl font-extrabold text-zinc-900 mb-6 flex items-center justify-between">
              <span>History</span>
              <span className="text-sm text-zinc-400 font-bold hover:text-zinc-800 cursor-pointer transition">
                View All
              </span>
            </h3>

            {history.length === 0 ? (
              <p className="text-zinc-400 font-medium text-center mt-10">
                No previous donations.
              </p>
            ) : (
              <div className="space-y-4">
                {history.map((record) => (
                  <div
                    key={record.recordId}
                    className="group p-4 rounded-2xl hover:bg-zinc-50 transition border border-transparent hover:border-zinc-100"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-zinc-900">
                        Request #{record.request.requestId}
                      </span>
                      <span className="text-xs font-bold bg-zinc-100 text-zinc-600 px-2 py-1 rounded-lg">
                        {new Date(record.donationDate).toLocaleDateString(
                          undefined,
                          { month: "short", day: "numeric" },
                        )}
                      </span>
                    </div>
                    <div className="flex items-center text-sm font-medium text-zinc-500">
                      <span className="w-2 h-2 rounded-full bg-lime-400 mr-2"></span>
                      Donated {record.request.bloodTypeNeeded}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
