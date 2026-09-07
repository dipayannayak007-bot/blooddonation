import { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export default function HospitalDashboard({
  requesterId,
  initialRequestId,
  hospitalName,
}) {
  const [requestStatus, setRequestStatus] = useState("open");
  const [respondingDonor, setRespondingDonor] = useState(null);
  const [connected, setConnected] = useState(false);

  // This state was missing, which caused the crash when the WebSocket tried to update it
  const [matchMessage, setMatchMessage] = useState("");

  useEffect(() => {
    const socket = new SockJS(
      "https://pulsenode-backend.onrender.com/ws-blood-donation",
    );
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        setConnected(true);
        // Hospital listens to updates for their specific requester ID
        stompClient.subscribe(`/topic/requests/${requesterId}`, (message) => {
          const response = JSON.parse(message.body);
          if (response.status === "matched") {
            setMatchMessage(
              `🚨 Match Confirmed: ${response.donorName} is on the way!`,
            );
            // Update the status state to change the UI badge
            setRequestStatus("MATCHED");
          }
        });
      },
    });

    stompClient.activate();
    return () => {
      if (stompClient) stompClient.deactivate();
    };
  }, [requesterId, initialRequestId]);

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-6 border border-gray-100 mt-6">
      <h2 className="text-2xl font-bold text-blue-900 mb-2">
        Hospital Command Center
      </h2>
      <p className="text-sm text-green-600 flex items-center mb-6 font-semibold">
        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
        {/* hospitalName is now properly passed in and will render here */}
        Live Status Feed Active for {hospitalName}
      </p>

      <div className="border rounded-lg p-5 bg-gray-50 shadow-inner">
        <h3 className="font-bold text-lg text-gray-800 border-b pb-2 mb-4">
          Active Emergency Dispatch
        </h3>

        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600 font-medium">Status:</span>
          <span
            className={`px-3 py-1 rounded text-sm font-bold shadow-sm ${
              requestStatus === "MATCHED"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {requestStatus === "MATCHED" ? "MATCHED" : "OPEN - SEARCHING"}
          </span>
        </div>

        {/* When the WebSocket receives a match, this green box will appear */}
        {matchMessage && (
          <div className="mt-4 p-4 bg-green-600 text-white rounded-lg font-bold text-center shadow-md animate-fade-in">
            {matchMessage}
          </div>
        )}
      </div>
    </div>
  );
}
