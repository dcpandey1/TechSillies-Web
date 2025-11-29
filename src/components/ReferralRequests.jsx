/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import { BaseURL } from "../constants/data";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { MdCheckCircle, MdPending, MdCancel, MdLink, MdPerson, MdWork } from "react-icons/md";
import toast from "react-hot-toast";

// Helper for rendering status badges
const StatusBadge = ({ status }) => {
  let colorClass = "bg-gray-700 text-gray-300";
  let Icon = MdPending;

  if (status === "Accepted") {
    colorClass = "bg-green-900/50 text-green-400 border border-green-700";
    Icon = MdCheckCircle;
  } else if (status === "Rejected") {
    colorClass = "bg-red-900/50 text-red-400 border border-red-700";
    Icon = MdCancel;
  } else if (status === "Pending") {
    colorClass = "bg-yellow-900/50 text-yellow-400 border border-yellow-700";
    Icon = MdPending;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${colorClass}`}
    >
      <Icon className="text-base" />
      {status}
    </span>
  );
};

const ReferralRequests = () => {
  const [requests, setRequests] = useState({ received: [], sent: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Pending");
  const location = useLocation();

  // 🔍 Read the ?view param (default: received)
  const params = new URLSearchParams(location.search);
  const viewType = params.get("view") || "received";

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const [receivedRes, sentRes] = await Promise.all([
        axios.get(`${BaseURL}/received`, { withCredentials: true }),
        axios.get(`${BaseURL}/sent`, { withCredentials: true }),
      ]);

      setRequests({
        received: receivedRes.data.requests || [],
        sent: sentRes.data.requests || [],
      });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching referral requests:", err);
      toast.error("Failed to load requests.");
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    const action = status === "Accepted" ? "Accepting" : "Rejecting";
    const toastId = toast.loading(`${action} referral...`);

    try {
      await axios.post(`${BaseURL}/update/${id}`, { status }, { withCredentials: true });

      setRequests((prev) => ({
        ...prev,
        received: prev.received.map((r) => (r._id === id ? { ...r, status } : r)),
      }));

      toast.success(`Referral request ${status} successfully!`, { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${action} request.`, { id: toastId });
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-400">Loading requests...</p>;

  const currentList = requests[viewType] || [];
  const filteredRequests =
    viewType === "sent" ? currentList : currentList.filter((r) => r.status === activeTab);

  const listVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div className=" min-h-screen">
      <div className="max-w-3xl mx-auto p-6 md:p-8 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-white pb-2 border-b border-gray-700">
          <span className="bg-clip-text bg-gradient-to-r from-primary to-secondary text-transparent">
            {viewType === "sent" ? "Sent Referral Requests" : "Received Referral Requests"}
          </span>
        </h2>

        {/* 🟢 Status filter for RECEIVED only */}
        {viewType === "received" && (
          <div className="flex justify-center gap-3">
            {["Pending", "Accepted", "Rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-xl font-semibold transition-all duration-300 shadow-md ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-primary/30"
                    : "bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* 🧾 List/Empty State */}
        {filteredRequests.length === 0 ? (
          <div className="text-center mt-20 p-8 bg-gray-800/50 rounded-xl border border-gray-700">
            <h2 className="text-xl font-semibold text-gray-300">
              No {viewType === "sent" ? "Sent" : `${activeTab} `} Requests Found
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              {viewType === "sent"
                ? "You haven't requested any referrals yet."
                : "No requests match the current status filter."}
            </p>
          </div>
        ) : (
          <motion.div className="space-y-4" variants={listVariants} initial="hidden" animate="visible">
            <AnimatePresence>
              {filteredRequests.map((req) => {
                const isReceived = viewType === "received";
                const userDetail = isReceived ? req.sender : req.receiver;
                const cardStatus = req.status || "Pending";

                return (
                  <motion.div
                    key={req._id}
                    className={`p-5 rounded-xl border shadow-xl bg-gray-800/50 border-gray-700 transition-all duration-300`}
                    variants={itemVariants}
                    layout
                  >
                    {/* User Info & Status */}
                    <div className="flex justify-between items-start border-b border-gray-700/50 pb-3 mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={userDetail?.imageURL}
                          alt="user"
                          className="w-12 h-12 rounded-full object-cover border-2 border-primary/50"
                        />
                        <div>
                          <h3 className="font-semibold text-lg text-white flex items-center gap-2">
                            <MdPerson className="text-secondary" />
                            {`${userDetail?.firstName} ${userDetail?.lastName}`}
                          </h3>
                          <p className="text-gray-400 text-sm flex items-center gap-1">
                            <MdWork className="text-secondary" />
                            {`@ ${userDetail?.company || "N/A"}`}
                          </p>
                        </div>
                      </div>

                      <StatusBadge status={cardStatus} />
                    </div>

                    {/* LINKS and ACTIONS CONTAINER */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      {/* Links Group (Left/Top) */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                        <span className="flex items-center text-gray-400">
                          <MdLink className="mr-1 text-secondary" />
                          <a
                            href={req.jobLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                          >
                            Job Link
                          </a>
                        </span>
                        <span className="flex items-center text-gray-400">
                          <MdLink className="mr-1 text-secondary" />
                          <a
                            href={req.resumeLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                          >
                            Resume Link
                          </a>
                        </span>
                      </div>

                      {/* Action Buttons Group (Right/Bottom) */}
                      {isReceived && cardStatus === "Pending" && (
                        <div className="flex gap-3 mt-2 sm:mt-0">
                          <motion.button
                            onClick={() => handleAction(req._id, "Accepted")}
                            className="px-3 py-1.5 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition-all duration-200 shadow-md shadow-primary/30"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Accept
                          </motion.button>
                          <motion.button
                            onClick={() => handleAction(req._id, "Rejected")}
                            className="px-3 py-1.5 rounded-xl bg-gray-700 text-gray-300 text-sm font-semibold border border-gray-600 hover:bg-gray-600 transition-all duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Reject
                          </motion.button>
                        </div>
                      )}
                    </div>

                    {/* Message (Below Links and Actions) */}
                    {req.message && (
                      <p className="mt-3 text-gray-300 border-t border-gray-800 pt-3 text-sm">
                        **Message:** {req.message}
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ReferralRequests;
