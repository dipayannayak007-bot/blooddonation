import React, { useState } from "react";
import { Home, Activity, FileText, Users, LogOut, X, Building } from "lucide-react";

export default function Sidebar({ role, onLogout, activeTab, setActiveTab }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const menuItems = {
    donor: [
      { id: "dashboard", name: "Dashboard", icon: Home },
      { id: "history", name: "History", icon: Activity },
      { id: "rewards", name: "Rewards", icon: FileText },
    ],
    requester: [
      { id: "dashboard", name: "Command Center", icon: Home },
      { id: "submit", name: "Submit SOS", icon: Activity },
    ],
    admin: [
      { id: "dashboard", name: "Overview", icon: Home },
      { id: "hospitals", name: "Hospitals", icon: Users },
      { id: "donors", name: "Donors", icon: Activity },
    ],
  };

  const items = menuItems[role] || [];

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl relative z-10 overflow-hidden animate-fade-in border border-zinc-100">
            <div className="bg-[#151515] p-8 text-white relative overflow-hidden">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition text-white z-20"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg shadow-rose-500/30 mb-6">
                  🩸
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight">
                  Why Blood Matters
                </h2>
                <p className="text-zinc-400 font-medium mt-2">
                  The critical impact of your donation.
                </p>
              </div>
              {/* Decorations */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl"></div>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-lime-100 text-lime-600 rounded-xl flex items-center justify-center font-bold shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900">
                    Saves up to 3 lives
                  </h4>
                  <p className="text-sm text-zinc-500 font-medium mt-1">
                    A single donation can be separated into red cells,
                    platelets, and plasma.
                  </p>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900">
                    Critical Shortage in India
                  </h4>
                  <p className="text-sm text-zinc-500 font-medium mt-1">
                    India faces an annual deficit of over 1 million blood units.
                    Your timely donation directly bridges this gap.
                  </p>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center font-bold shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900">Health Benefits</h4>
                  <p className="text-sm text-zinc-500 font-medium mt-1">
                    Regular donation helps maintain healthy iron levels,
                    improves heart health, and provides a mini check-up.
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <a
                  href="https://www.eraktkosh.in/"
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full py-4 text-center bg-zinc-900 text-white font-bold rounded-2xl hover:bg-black transition shadow-lg shadow-zinc-900/20"
                >
                  Visit eRaktKosh (Govt. of India)
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 bg-[#151515] text-white flex-col justify-between p-6 rounded-[32px] my-4 ml-4 h-[calc(100vh-2rem)] shadow-2xl relative z-50">
        <div>
          <div className="flex items-center space-x-3 mb-12 pl-2 mt-2">
            <div className="w-10 h-10 bg-rose-500 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg shadow-rose-500/30">
              P
            </div>
            <span className="text-2xl font-extrabold tracking-tight">
              PulseNode
            </span>
          </div>
          <nav className="space-y-2">
            {items.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? "bg-rose-500 text-white font-semibold shadow-md shadow-rose-500/20"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 ${isActive ? "text-white" : "text-zinc-500"}`}
                  />
                  <span className="text-sm">{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div>
          <div className="bg-[#D4F770] text-black p-5 rounded-[24px] mb-6 text-center shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="font-extrabold mb-1">Save a Life</h4>
              <p className="text-xs font-medium opacity-80 mb-4">
                Your contribution matters
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#151515] text-white text-xs font-bold py-2.5 px-4 rounded-xl w-full hover:bg-black transition-colors"
              >
                Learn More
              </button>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-white/30 rounded-full blur-lg"></div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-4 px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
          >
            <LogOut className="w-5 h-5 text-zinc-500" />
            <span className="text-sm font-medium">Log Out</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#151515] text-white p-3 flex justify-around items-center z-[90] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] pb-safe rounded-t-3xl border-t border-zinc-800">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center space-y-1 p-2 rounded-xl transition-all ${
                isActive ? "text-rose-500" : "text-zinc-500 hover:text-white"
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </button>
          );
        })}
        <button
          onClick={onLogout}
          className="flex flex-col items-center justify-center space-y-1 p-2 rounded-xl transition-all text-zinc-500 hover:text-white"
        >
          <LogOut className="w-6 h-6" />
          <span className="text-[10px] font-medium">Log Out</span>
        </button>
      </div>
    </>
  );
}
