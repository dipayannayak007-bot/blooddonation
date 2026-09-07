import { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";

export default function DonorDashboard({ donorId, donorName }) {
  const [alerts, setAlerts] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = new SockJS(
      "https://pulsenode-backend.onrender.com/ws-blood-donation",
    );
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
      await axios.post(
        `https://pulsenode-backend.onrender.com/api/requests/${requestId}/responses`,
        {
          donorId: donorId,
          answer: "accept",
        },
      );
      setAlerts(alerts.filter((alert) => alert.requestId !== requestId));
      alert("Thank you! The hospital has been notified of your response.");
    } catch (error) {
      console.error("Failed to send response", error);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 mt-10 border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-800">Donor Dashboard</h1>

      <div className="flex items-center space-x-2">
        <div
          className={`w-3 h-3 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`}
        ></div>
        <p className="text-green-600 text-sm font-semibold mb-6 flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Active as {donorName} {/* <-- Now uses their real registered name */}
        </p>
      </div>

      <div className="space-y-4 mt-6">
        <h2 className="text-lg font-semibold border-b pb-2">
          Incoming Emergencies
        </h2>
        {alerts.length === 0 ? (
          <p className="text-gray-500 italic">
            No active requests in your area.
          </p>
        ) : (
          alerts.map((alert, index) => (
            <div
              key={index}
              className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md"
            >
              <h3 className="text-red-700 font-bold">{alert.message}</h3>
              <p className="text-sm text-red-600 mt-1">
                Blood Type Needed: <strong>{alert.bloodType}</strong>
              </p>
              <p className="text-sm text-red-600">
                Urgency: <strong>{alert.urgency}</strong>
              </p>

              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => handleAccept(alert.requestId)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium transition"
                >
                  I Can Donate
                </button>
                <button
                  onClick={() =>
                    setAlerts(
                      alerts.filter((a) => a.requestId !== alert.requestId),
                    )
                  }
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                >
                  Decline
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
