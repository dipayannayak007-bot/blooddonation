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
        { email, password, role },
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
      <main className="modern-auth">
        <div className="auth-glow auth-glow-one" />
        <div className="auth-glow auth-glow-two" />

        <section className="auth-layout">
          <div className="auth-brand-panel">
            <div className="brand-mark">♥</div>
            <p className="eyebrow">SMART BLOOD NETWORK</p>
            <h1>PulseNode</h1>
            <p className="brand-copy">
              Connecting donors, hospitals and urgent blood requests in one
              simple platform.
            </p>
            <div className="trust-row">
              <span>●</span> Secure access
              <span>●</span> Fast coordination
            </div>
          </div>

          <div className="auth-card">
            <div className="auth-card-header">
              <p className="auth-kicker">WELCOME BACK</p>
              <h2>Sign in to your account</h2>
              <p>Manage donations and blood requests from your dashboard.</p>
            </div>

            <form onSubmit={handleLogin} className="modern-form">
              {error && (
                <div role="alert" className="modern-error">
                  <span>!</span>
                  {error}
                </div>
              )}

              <label>
                <span>Email address</span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </label>

              <label>
                <span>Password</span>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </label>

              <label>
                <span>Account type</span>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="donor">Donor · Receive alerts</option>
                  <option value="hospital">Hospital · Request blood</option>
                </select>
              </label>

              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className="modern-primary-button"
              >
                <span>{loading ? "Signing you in..." : "Continue securely"}</span>
                {!loading && <span className="button-arrow">→</span>}
              </button>
            </form>

            <div className="auth-register">
              <p>New to PulseNode?</p>
              <div>
                <button onClick={() => setIsRegistering(true)}>
                  Register as donor
                </button>
                <button onClick={() => setIsRegisteringHospital(true)}>
                  Register hospital
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <div className="modern-app-shell">
      <header className="modern-topbar">
        <div className="modern-logo">
          <span>♥</span>
          <div>
            <strong>PulseNode</strong>
            <small>Blood Network</small>
          </div>
        </div>

        <div className="modern-session">
          <span className="status-dot" />
          <span>{currentView === "donor" ? "Donor dashboard" : "Hospital dashboard"}</span>
          <button
            onClick={() => {
              setCurrentView("login");
              setUserId(null);
              setEmail("");
              setPassword("");
            }}
            className="pulse-logout-button"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="modern-content">
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
      </main>
    </div>
  );
}
