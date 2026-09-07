import { useState } from "react";
import axios from "axios";
import DonorDashboard from "./DonorDashboard";
import SubmitRequest from "./SubmitRequest";
import DonorRegistration from "./DonorRegistration";
import HospitalRegistration from "./HospitalRegistration";

export default function App() {
  const [currentView, setCurrentView] = useState("login");
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegisteringHospital, setIsRegisteringHospital] = useState(false);

  // Keep login fields controlled so validation and reset behavior stay predictable.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("donor");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://pulsenode-backend.onrender.com/api/auth/login",
        {
          email: email,
          password: password,
          role: role,
        },
      );

      setUserId(response.data.id);
      setUserName(response.data.name);
      setCurrentView(role === "donor" ? "donor" : "requester");
    } catch (err) {
      setError("Account not found or incorrect password.");
    } finally {
      setLoading(false);
    }
  };

  if (isRegistering) {
    return (
      <DonorRegistration
        onCancel={() => setIsRegistering(false)}
        onRegisterSuccess={(newId) => {
          setUserId(newId);
          setCurrentView("donor");
          setIsRegistering(false);
        }}
      />
    );
  }
  if (isRegisteringHospital) {
    return (
      <HospitalRegistration
        onCancel={() => setIsRegisteringHospital(false)}
        onRegisterSuccess={(newId) => {
          setUserId(newId);
          setCurrentView("requester");
          setIsRegisteringHospital(false);
        }}
      />
    );
  }

  if (currentView === "login") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              🩸
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              PulseNode
            </h1>
            <p className="text-gray-500 mt-2">Secure Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div
                role="alert"
                className="bg-red-50 text-red-600 p-3 rounded text-sm border border-red-200"
              >
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="w-full rounded-md border-gray-300 shadow-sm p-2.5 border focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md border-gray-300 shadow-sm p-2.5 border focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Account Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm p-2.5 border focus:ring-2 focus:ring-red-500 focus:outline-none"
              >
                <option value="donor">Donor (Receive Alerts)</option>
                <option value="hospital">Hospital (Request Blood)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className={`w-full py-3 mt-4 text-white rounded-lg font-bold transition shadow-md ${
                loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {loading ? "Authenticating..." : "Secure Login"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500 flex flex-col space-y-2">
            <div>
              New donor?{" "}
              <button
                onClick={() => setIsRegistering(true)}
                className="text-red-600 font-bold hover:underline"
              >
                Register here
              </button>
            </div>
            <div>
              New hospital?{" "}
              <button
                onClick={() => setIsRegisteringHospital(true)}
                className="text-blue-600 font-bold hover:underline"
              >
                Register here
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">
            {currentView === "donor"
              ? "Donor Radar Active"
              : "Hospital Command Center"}
          </h1>
          <button
            onClick={() => {
              setCurrentView("login");
              setUserId(null);
              setEmail("");
              setPassword("");
            }}
            className="text-sm font-semibold text-gray-500 hover:text-red-600 transition"
          >
            Log Out
          </button>
        </div>

        {currentView === "donor" && (
          <DonorDashboard donorId={userId} donorName={userName} />
        )}
        {currentView === "requester" && (
          <SubmitRequest
            requesterId={userId}
            hospitalName={userName}
            onBack={() => setCurrentView("login")}
          />
        )}
      </div>
    </div>
  );
}
