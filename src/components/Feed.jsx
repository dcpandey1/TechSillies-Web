import axios from "axios";
import { BaseURL } from "../constants/data";
import { MdGroup, MdCheckCircle, MdPending, MdRocketLaunch } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addFeed, removeOneUserFromFeed } from "../utils/feedSlice";
import { motion, AnimatePresence } from "framer-motion";
import { isValidUrl } from "../utils/isValidURLS";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const [stats, setStats] = useState(null);
  const user = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFeed, setFilteredFeed] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    jobLink: "",
    resumeLink: "",
    email: "",
  });

  // Fetch users for feed
  const fetchFeed = async () => {
    if (feed && feed.length > 0) {
      setFilteredFeed(feed);
      return;
    }
    try {
      const res = await axios.get(BaseURL + "/user/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.feedUsers));
      setFilteredFeed(res?.data?.feedUsers);
    } catch (error) {
      console.error("Error fetching feed:", error);
    }
  };

  // Fetch platform stats
  const fetchStats = async () => {
    try {
      const res = await axios.get(`${BaseURL}/stats`, {
        withCredentials: true,
      });
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchFeed();
    fetchStats();
  }, []);

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(BaseURL + "/send/request/" + status + "/" + userId, {}, { withCredentials: true });
      dispatch(removeOneUserFromFeed(userId));
      setFilteredFeed((prev) => prev.filter((u) => u._id !== userId));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredFeed(feed);
      return;
    }
    const filtered = feed.filter((user) => user.company?.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredFeed(filtered);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setFilteredFeed(feed);
  };

  const openReferralModal = (selected) => {
    setSelectedUser(selected);
    setFormData({
      jobLink: "",
      resumeLink: "",
      email: user?.user?.email || "",
    });
    setShowModal(true);
  };

  const handleReferralSubmit = async () => {
    const { jobLink, resumeLink, email } = formData;
    if (!jobLink || !resumeLink || !email) {
      alert("Please fill all fields before submitting.");
      return;
    }
    if (!isValidUrl(jobLink)) {
      return alert("Please enter a valid job link");
    }

    if (!isValidUrl(resumeLink)) {
      return alert("Please upload a valid resume link");
    }

    try {
      await axios.post(
        `${BaseURL}/referral/send/${selectedUser._id}`,
        { jobLink, resumeLink },
        { withCredentials: true }
      );
      alert(`Referral request sent to ${selectedUser.firstName}`);
      setShowModal(false);
    } catch (error) {
      alert(error.response?.data?.error || "Something went wrong");
    }
  };

  if (!feed) return null;

  return (
    <motion.section
      className="min-h-screen py-10 px-4 md:px-8 lg:px-12 mb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="text-center mb-10">
        <motion.h2 className="mb-4 text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Suggested Connections
        </motion.h2>

        {/* Search */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-4 w-full max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search by company name..."
            className="flex-grow min-w-[150px] px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/50 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 rounded-xl bg-primary text-gray-100 font-semibold hover:scale-105 transition-transform duration-200"
          >
            Search
          </button>
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="px-4 py-2 rounded-xl bg-slate-700 text-gray-300 font-semibold hover:bg-slate-600 transition duration-200"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_260px] gap-8 lg:gap-12 justify-center items-start">
        {/* Left Sidebar (Stats) */}
        <motion.aside
          className="hidden lg:block bg-slate-900/60 border border-slate-700 rounded-2xl p-5 shadow-xl h-fit"
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-bold mb-4 text-secondary text-center">Techsillies Insights</h3>
          {stats ? (
            <ul className="flex flex-col gap-4 text-gray-300">
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MdGroup className="text-blue-400 text-xl" /> Total Users
                </div>
                <span className="font-semibold">{stats.totalUsers}</span>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MdRocketLaunch className="text-purple-400 text-xl" /> Referrals Sent
                </div>
                <span className="font-semibold">{stats.totalReferrals}</span>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MdCheckCircle className="text-green-400 text-xl" /> Accepted
                </div>
                <span className="font-semibold">{stats.totalAccepted}</span>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MdPending className="text-yellow-400 text-xl" /> Pending
                </div>
                <span className="font-semibold">{stats.totalPending}</span>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MdGroup className="text-cyan-400 text-xl" /> Active This Week
                </div>
                <span className="font-semibold">{stats.activeUsers}</span>
              </li>
            </ul>
          ) : (
            <p className="text-gray-500 text-sm text-center mt-6">Loading stats...</p>
          )}
        </motion.aside>

        {/* Center Feed */}
        <div className="flex flex-col gap-8 items-center w-full">
          {filteredFeed.length === 0 ? (
            <p className="text-gray-400 mt-6 text-center">No users found for that company.</p>
          ) : (
            filteredFeed.map((user, idx) => (
              <motion.div
                key={user._id}
                className="flex flex-col sm:flex-row items-center bg-slate-800/25 border border-gray-700 shadow-2xl rounded-2xl p-5 sm:p-6 w-full max-w-xl hover:shadow-primary/40 transition-shadow duration-300"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-gray-600 flex-shrink-0">
                  <motion.img
                    src={user.imageURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left w-full">
                  <h3 className="text-xl font-bold text-gray-100">
                    {user.firstName} {user.lastName || ""}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {user.headline} @ <span className="text-gray-300 font-medium">{user.company}</span>
                  </p>
                  {user.skills?.length > 0 && (
                    <p className="mt-2 text-sm text-gray-400">
                      <span className="text-gray-500">Expert in:</span> {user.skills.join(", ")}
                    </p>
                  )}

                  {/* Mobile-friendly button widths */}
                  <div className="mt-4 flex flex-col sm:flex-row gap-3 items-center justify-center sm:items-start sm:justify-start w-full">
                    <motion.button
                      className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-primary text-gray-300 font-semibold text-sm sm:text-base hover:scale-105 transition-transform duration-200 w-32 sm:w-auto"
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleSendRequest("interested", user._id)}
                    >
                      Connect
                    </motion.button>
                    <motion.button
                      className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-gray-100 font-semibold text-sm sm:text-base hover:scale-105 transition-transform duration-200 w-36 sm:w-auto"
                      whileHover={{ scale: 1.05 }}
                      onClick={() => openReferralModal(user)}
                    >
                      Ask for Referral
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Right Sidebar (Testimonials) */}
        <motion.aside
          className="hidden lg:block bg-slate-800/25 border border-gray-700 shadow-2xl rounded-2xl p-5 h-fit"
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-bold mb-4 text-secondary text-center">What Users Say</h3>
          <div className="flex flex-col gap-5 text-gray-300">
            <div className="bg-slate-800/50 rounded-xl p-4 shadow-md hover:shadow-primary/30 transition">
              <p className="italic text-sm">
                “Techsillies helped me connect with amazing developers. I even got a referral within a week!”
              </p>
              <div className="mt-3 flex items-center gap-3">
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="user"
                  className="w-10 h-10 rounded-full border border-slate-600"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-100">Neha Sharma</p>
                  <p className="text-xs text-gray-400">Frontend Developer @ Zoho</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-4 shadow-md hover:shadow-secondary/30 transition">
              <p className="italic text-sm">
                “Clean interface, real people, and great opportunities. Techsillies is a must for developers!”
              </p>
              <div className="mt-3 flex items-center gap-3">
                <img
                  src="https://randomuser.me/api/portraits/men/37.jpg"
                  alt="user"
                  className="w-10 h-10 rounded-full border border-slate-600"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-100">Ravi Kumar</p>
                  <p className="text-xs text-gray-400">Full Stack Dev @ Accenture</p>
                </div>
              </div>
            </div>
          </div>
        </motion.aside>
      </div>

      {/* Referral Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-lg text-gray-200"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold mb-4 text-center">
                Ask {selectedUser?.firstName} for a Referral
              </h3>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Job Link"
                  value={formData.jobLink}
                  onChange={(e) => setFormData({ ...formData, jobLink: e.target.value })}
                  className="px-3 py-2 rounded-md bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-primary outline-none"
                />
                <input
                  type="text"
                  placeholder="Resume Link"
                  value={formData.resumeLink}
                  onChange={(e) => setFormData({ ...formData, resumeLink: e.target.value })}
                  className="px-3 py-2 rounded-md bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-primary outline-none"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="px-3 py-2 rounded-md bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReferralSubmit}
                  className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:scale-105 transition-transform"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default Feed;
