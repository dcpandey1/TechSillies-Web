import { useEffect, useState } from "react";
import axios from "axios";
import { BaseURL } from "../constants/data";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const ReferralRequests = () => {
  const [requests, setRequests] = useState({ received: [], sent: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Pending");
  const location = useLocation();

  // 🔍 Read the ?view param (default: received)
  const params = new URLSearchParams(location.search);
  const viewType = params.get("view") || "received";

  const fetchRequests = async () => {
    try {
      const [receivedRes, sentRes] = await Promise.all([
        axios.get(`${BaseURL}/received`, { withCredentials: true }),
        axios.get(`${BaseURL}/sent`, { withCredentials: true }),
      ]);

      setRequests({
        received: receivedRes.data.requests,
        sent: sentRes.data.requests,
      });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching referral requests:", err);
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    try {
      await axios.post(`${BaseURL}/update/${id}`, { status }, { withCredentials: true });
      setRequests((prev) => ({
        ...prev,
        received: prev.received.map((r) => (r._id === id ? { ...r, status } : r)),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-400">Loading...</p>;

  const currentList = requests[viewType] || [];
  const filteredRequests =
    viewType === "sent" ? currentList : currentList.filter((r) => r.status === activeTab);

  return (
    <motion.div className="max-w-xl mx-auto p-6 space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
        {viewType === "sent" ? "Sent Referral Requests" : "Received Referral Requests"}
      </h2>

      {/* 🟢 Status filter for RECEIVED only */}
      {viewType === "received" && (
        <div className="flex justify-center gap-3 mb-6">
          {["Pending", "Accepted", "Rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                activeTab === tab
                  ? "bg-gradient-to-r from-primary to-secondary text-white"
                  : "bg-slate-700/50 text-gray-300 hover:bg-slate-600/60"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* 🧾 No Requests */}
      {filteredRequests.length === 0 ? (
        <div className="text-center mt-20">
          <h2 className="text-xl font-semibold text-gray-400">
            No {viewType === "sent" ? "Sent" : `${activeTab} Received`} Requests
          </h2>
        </div>
      ) : (
        filteredRequests.map((req) => {
          const cardClass =
            viewType === "sent"
              ? "border-slate-700 bg-slate-800/40"
              : req.status === "Accepted"
              ? "border-green-700 bg-green-900/20"
              : req.status === "Rejected"
              ? "border-red-700 bg-red-900/20"
              : "border-slate-700 bg-slate-800/20";

          return (
            <motion.div
              key={req._id}
              className={`p-5 rounded-xl border shadow-lg ${cardClass}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-4">
                <img
                  src={viewType === "received" ? req.sender?.imageURL : req.receiver?.imageURL}
                  alt="user"
                  className="w-14 h-14 rounded-full object-cover border border-gray-600"
                />
                <div>
                  <h3 className="font-semibold text-lg text-white">
                    {viewType === "received"
                      ? `${req.sender?.firstName} ${req.sender?.lastName}`
                      : `${req.receiver?.firstName} ${req.receiver?.lastName}`}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {viewType === "received" ? req.sender?.company : req.receiver?.company}
                  </p>
                  <div className="text-sm mt-1">
                    <a href={req.jobLink} target="_blank" rel="noreferrer" className="text-blue-400">
                      Job Link
                    </a>{" "}
                    |{" "}
                    <a href={req.resumeLink} target="_blank" rel="noreferrer" className="text-blue-400">
                      Resume
                    </a>
                  </div>
                  {req.message && <p className="mt-2 text-gray-300 text-sm">{req.message}</p>}
                </div>
              </div>

              {/* Action Buttons */}
              {viewType === "received" && req.status === "Pending" && (
                <div className="mt-4 flex gap-3 justify-end">
                  <button
                    onClick={() => handleAction(req._id, "Accepted")}
                    className="px-4 py-2 rounded-md bg-primary text-white font-semibold hover:scale-105 transition-transform duration-200"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleAction(req._id, "Rejected")}
                    className="px-4 py-2 rounded-md bg-secondary text-white font-semibold hover:scale-105 transition-transform duration-200"
                  >
                    Reject
                  </button>
                </div>
              )}
            </motion.div>
          );
        })
      )}
    </motion.div>
  );
};

export default ReferralRequests;
