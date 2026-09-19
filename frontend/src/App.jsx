import { API_BASE_URL } from './config';
import { useState } from "react";
import axios from "axios";
import DonorDashboard from "./DonorDashboard";
import SubmitRequest from "./SubmitRequest";
import HospitalDashboard from "./HospitalDashboard";
import AdminDashboard from "./AdminDashboard";
import CompleteProfile from "./CompleteProfile";
import Sidebar from "./Sidebar";
import { useGoogleLogin } from "@react-oauth/google";

export default function App() {
  const [currentView, setCurrentView] = useState("login"); // login | donor | requester | admin
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");

  // Used when profile is incomplete
  const [tempUser, setTempUser] = useState(null);

  // Admin login states
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        {
          email: adminEmail,
          password: adminPassword,
          role: "admin",
        },
      );

      if (response.data.role === "admin") {
        setCurrentView("admin");
      }
    } catch (err) {
      setAdminError("Invalid admin credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginCustom = async (tokenResponse, role) => {
    try {
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        },
      );
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/google-login`,
        {
          token: "mock-google-token",
          role: role,
          email: userInfo.data.email,
          name: userInfo.data.name,
        },
      );

      if (response.status === 200) {
        setUserId(response.data.id);
        setUserName(response.data.name);
        setCurrentView(role === "donor" ? "donor" : "requester");
      } else if (response.status === 202) {
        setTempUser(response.data);
      }
    } catch (err) {
      console.error("Google login failed", err);
      alert("Login failed. Check console.");
    }
  };

  const loginDonor = useGoogleLogin({
    onSuccess: (res) => handleGoogleLoginCustom(res, "donor"),
  });

  const loginHospital = useGoogleLogin({
    onSuccess: (res) => handleGoogleLoginCustom(res, "hospital"),
  });

  const handleProfileComplete = (id, role, name) => {
    setUserId(id);
    setUserName(name);
    setCurrentView(role === "donor" ? "donor" : "requester");
    setTempUser(null);
  };

  const [activeTab, setActiveTab] = useState("dashboard");

  if (tempUser) {
    return (
      <CompleteProfile tempUser={tempUser} onComplete={handleProfileComplete} />
    );
  }

  if (currentView === "login") {
    return (
      <div className="min-h-screen font-sans flex overflow-hidden bg-white">
        {/* Left Side: Hero Section */}
        <div className="hidden lg:flex w-[55%] bg-[#151515] text-white p-16 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-lime-400/10 rounded-full blur-[100px] -ml-40 -mb-40"></div>

          <div className="relative z-10 mt-10">
            <div className="flex items-center space-x-4 mb-20">
              <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg shadow-rose-500/30 text-white">
                P
              </div>
              <span className="text-3xl font-extrabold tracking-tight">
                PulseNode
              </span>
            </div>

            <h1 className="text-6xl font-extrabold tracking-tighter leading-[1.1] mb-8">
              The modern network for <br />
              <span className="text-rose-500">saving lives.</span>
            </h1>
            <p className="text-zinc-400 text-xl font-medium max-w-lg leading-relaxed">
              An algorithmic dispatch system connecting hospitals with eligible
              blood donors instantly.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-8 mb-10">
            <div className="bg-white/5 p-8 rounded-[32px] backdrop-blur-sm border border-white/10 relative overflow-hidden group hover:bg-white/10 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-lime-400/30 transition-all"></div>
              <h3 className="text-5xl font-extrabold text-white mb-2 tracking-tighter relative z-10">
                &lt; 1 min
              </h3>
              <p className="text-sm font-medium text-zinc-400 relative z-10">
                Average SOS dispatch time to local radar.
              </p>
            </div>
            <div className="bg-white/5 p-8 rounded-[32px] backdrop-blur-sm border border-white/10 relative overflow-hidden group hover:bg-white/10 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-400/30 transition-all"></div>
              <h3 className="text-5xl font-extrabold text-white mb-2 tracking-tighter relative z-10">
                100%
              </h3>
              <p className="text-sm font-medium text-zinc-400 relative z-10">
                Verified hospitals and eligible donors.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Panel */}
        <div className="w-full lg:w-[45%] flex items-center justify-center p-8 bg-zinc-50 relative">
          <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-12 border border-zinc-100 relative z-10">
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-zinc-900 text-white rounded-[28px] flex items-center justify-center mx-auto mb-8 text-3xl shadow-xl shadow-zinc-900/20">
                <svg
                  className="w-10 h-10 text-lime-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
                PulseNode
              </h1>
              <p className="text-zinc-500 mt-2 font-medium">Secure Portal</p>
            </div>

            {!showAdminLogin ? (
              <div className="space-y-6">
                <div className="bg-zinc-50 p-6 rounded-3xl text-center border border-zinc-100 transition hover:border-zinc-200 hover:shadow-md">
                  <h3 className="text-lg font-bold text-zinc-800 mb-2">
                    Donor Login
                  </h3>
                  <p className="text-sm text-zinc-500 mb-5 font-medium">
                    Sign in to donate and save lives.
                  </p>
                  <div className="flex justify-center">
                    <button
                      onClick={() => loginDonor()}
                      className="flex items-center space-x-2 bg-white border border-zinc-200 px-6 py-2.5 rounded-xl shadow-sm hover:bg-zinc-50 transition font-bold text-zinc-700 text-sm"
                    >
                      <img
                        src="https://www.google.com/favicon.ico"
                        alt="Google"
                        className="w-4 h-4"
                      />
                      <span>Sign in with Google</span>
                    </button>
                  </div>
                </div>

                <div className="bg-zinc-50 p-6 rounded-3xl text-center border border-zinc-100 transition hover:border-zinc-200 hover:shadow-md">
                  <h3 className="text-lg font-bold text-zinc-800 mb-2">
                    Hospital Login
                  </h3>
                  <p className="text-sm text-zinc-500 mb-5 font-medium">
                    Sign in to request emergency blood.
                  </p>
                  <div className="flex justify-center">
                    <button
                      onClick={() => loginHospital()}
                      className="flex items-center space-x-2 bg-white border border-zinc-200 px-6 py-2.5 rounded-xl shadow-sm hover:bg-zinc-50 transition font-bold text-zinc-700 text-sm"
                    >
                      <img
                        src="https://www.google.com/favicon.ico"
                        alt="Google"
                        className="w-4 h-4"
                      />
                      <span>Sign in with Google</span>
                    </button>
                  </div>
                </div>

                <div className="text-center mt-6">
                  <button
                    onClick={() => setShowAdminLogin(true)}
                    className="text-xs font-semibold text-zinc-400 hover:text-zinc-600"
                  >
                    Admin Portal Access
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleAdminLogin}
                className="space-y-5 animate-fade-in"
              >
                <h3 className="text-center font-bold text-zinc-700">
                  Platform Admin
                </h3>
                {adminError && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-200 font-medium">
                    {adminError}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full rounded-xl border-zinc-200 shadow-sm p-3.5 border focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full rounded-xl border-zinc-200 shadow-sm p-3.5 border focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-zinc-900 text-white rounded-xl font-bold hover:bg-black transition shadow-lg mt-2"
                >
                  {loading ? "Authenticating..." : "Login as Admin"}
                </button>

                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => setShowAdminLogin(false)}
                    className="text-sm font-semibold text-zinc-500 hover:text-zinc-800"
                  >
                    ← Back to Public Login
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7] font-sans flex overflow-hidden">
      <Sidebar
        role={currentView}
        onLogout={() => {
          setCurrentView("login");
          setUserId(null);
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 overflow-y-auto p-8 h-screen">
        <div className="max-w-6xl mx-auto">
          {currentView === "donor" && (
            <DonorDashboard
              donorId={userId}
              donorName={userName}
              activeTab={activeTab}
            />
          )}
          {currentView === "requester" &&
            (activeTab === "submit" ? (
              <SubmitRequest
                requesterId={userId}
                hospitalName={userName}
                onBack={() => setActiveTab("dashboard")}
              />
            ) : (
              <HospitalDashboard
                initialRequestId={null}
                hospitalName={userName}
                requesterId={userId}
                activeTab={activeTab}
              />
            ))}
          {currentView === "admin" && <AdminDashboard activeTab={activeTab} />}
        </div>
      </main>
    </div>
  );
}
