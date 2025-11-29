/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import axios from "axios";
import { BaseURL } from "../constants/data";
import { MdGroup, MdCheckCircle, MdPending, MdRocketLaunch, MdSearch, MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef, useCallback } from "react";
import { updateUserStatus } from "../utils/feedSlice";
import { motion, AnimatePresence } from "framer-motion";
import { isValidUrl } from "../utils/isValidURLS";

// Helper component for Mobile Stats (Updated for Dark Mode)
const StatItem = ({ icon: Icon, label, value, colorClass }) => (
  <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-gray-800/70 backdrop-blur-sm rounded-xl min-w-[100px] shadow-lg border border-gray-700 transition-transform duration-300 hover:scale-[1.03]">
    <Icon className={`${colorClass} text-2xl mb-1`} />
    <span className="text-xl font-extrabold text-gray-50">{value}</span>
    <span className="text-xs text-gray-400 font-medium whitespace-nowrap mt-0.5">{label}</span>
  </div>
);

const Feed = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [feed, setFeed] = useState([]);
  const [filteredFeed, setFilteredFeed] = useState([]);
  const [stats, setStats] = useState(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const observer = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    jobLink: "",
    resumeLink: "",
    email: "",
  });

  // --- FUNCTIONALITY (UNCHANGED) ---
  const fetchStats = async () => {
    try {
      const res = await axios.get(`${BaseURL}/stats`, { withCredentials: true });
      setStats(res.data);
    } catch (error) {
      console.error("Stats fetch error:", error);
    }
  };

  const fetchFeed = useCallback(async () => {
    if (isSearching || !hasMore) return;
    setLoadingMore(true);
    try {
      const res = await axios.get(`${BaseURL}/user/feed?page=${page}&limit=20`, { withCredentials: true });
      const newData = res.data.feedUsers;
      const nextPg = res.data.pagination?.nextPage;
      setFeed((prev) => [...prev, ...newData]);
      setFilteredFeed((prev) => [...prev, ...newData]);
      if (nextPg) setPage(nextPg);
      else setHasMore(false);
    } catch (err) {
      console.log("Feed error:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [page, isSearching, hasMore]);

  useEffect(() => {
    fetchFeed();
    fetchStats();
  }, []);

  const lastElementRef = useCallback(
    (node) => {
      if (loadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !isSearching) {
          fetchFeed();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadingMore, hasMore, isSearching, fetchFeed]
  );

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setIsSearching(false);
      setFilteredFeed(feed);
      return;
    }
    setIsSearching(true);
    try {
      const res = await axios.get(`${BaseURL}/user/feed?search=${searchTerm}`, { withCredentials: true });
      setFilteredFeed(res.data.feedUsers);
    } catch (err) {
      console.log(err);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setIsSearching(false);
    setFilteredFeed(feed);
  };

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(`${BaseURL}/send/request/${status}/${userId}`, {}, { withCredentials: true });
      setFilteredFeed((prev) => prev.map((u) => (u._id === userId ? { ...u, connectionStatus: status } : u)));
      setFeed((prev) => prev.map((u) => (u._id === userId ? { ...u, connectionStatus: status } : u)));
      dispatch(updateUserStatus({ userId, status }));
    } catch (err) {
      console.log(err);
    }
  };

  const openReferralModal = (u) => {
    setSelectedUser(u);
    setFormData({
      jobLink: "",
      resumeLink: "",
      email: user?.user?.email || "",
    });
    setShowModal(true);
  };

  const handleReferralSubmit = async () => {
    const { jobLink, resumeLink, email } = formData;
    if (!jobLink || !resumeLink || !email) return alert("Please fill all fields");
    if (!isValidUrl(jobLink)) return alert("Enter valid job link");
    if (!isValidUrl(resumeLink)) return alert("Enter valid resume link");
    try {
      await axios.post(
        `${BaseURL}/referral/send/${selectedUser._id}`,
        { jobLink, resumeLink },
        { withCredentials: true }
      );
      alert(`Referral request sent to ${selectedUser.firstName}`);
      setShowModal(false);
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    }
  };

  // --- UI RENDER (IMPROVED DARK MODE) ---

  return (
    <motion.section
      className="min-h-screen py-6 px-4 md:py-8 md:px-8 lg:px-12  text-gray-50" // Base Dark Gray Background
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* MAIN HEADER */}
      <div className="text-center mb-8 sm:mb-10">
        <h1 className="mb-2 text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Suggested Connections
        </h1>
      </div>

      {/* STATS BAR (Mobile/Tablet) */}
      <div className="lg:hidden  mb-8 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex gap-4 px-2">
          {stats ? (
            <>
              <StatItem
                icon={MdGroup}
                label="Total Users"
                value={stats.totalUsers}
                colorClass="text-blue-400 text-sm"
              />
              <StatItem
                icon={MdRocketLaunch}
                label="Referrals Sent"
                value={stats.totalReferrals}
                colorClass="text-purple-400 text-sm"
              />
              <StatItem
                icon={MdCheckCircle}
                label="Accepted"
                value={stats.totalAccepted}
                colorClass="text-green-400  text-sm"
              />
              <StatItem
                icon={MdPending}
                label="Pending"
                value={stats.totalPending}
                colorClass="text-yellow-400 text-sm"
              />
              <StatItem
                icon={MdGroup}
                label="Active Weekly"
                value={stats.activeUsers}
                colorClass="text-cyan-400 text-sm"
              />
            </>
          ) : (
            <p className="text-gray-500 text-sm text-center w-full min-w-[200px]">Loading insights...</p>
          )}
        </div>
      </div>

      {/* SEARCH BAR */}
      {/* Search */}
      <div className="flex justify-center gap-2 max-w-xl mx-auto my-5">
        <input
          type="text"
          placeholder="Search by company name..."
          className="flex-grow min-w-[150px] px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/50 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch} className="px-4 py-2 bg-primary rounded-xl">
          Search
        </button>

        {searchTerm && (
          <button onClick={clearSearch} className="px-4 py-2 bg-gray-700 rounded-xl">
            Clear
          </button>
        )}
      </div>

      {/* 3 COLUMN GRID - Desktop/Tablet Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_260px] gap-8 lg:gap-12">
        {/* LEFT SIDEBAR — STATS (Desktop) */}
        <aside className="hidden lg:block bg-gray-800/25 border border-gray-700 rounded-2xl p-6 shadow-2xl h-fit">
          <h3 className="text-xl font-bold mb-5 text-secondary text-center">Global Insights</h3>
          {stats ? (
            <ul className="flex flex-col gap-4 text-gray-300">
              <li className="flex items-center justify-between p-2 bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <MdGroup className="text-blue-400 text-xl" /> Total Users
                </div>
                <span className="font-semibold text-gray-50">{stats.totalUsers}</span>
              </li>
              <li className="flex items-center justify-between p-2 bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <MdRocketLaunch className="text-purple-400 text-xl" /> Referrals Sent
                </div>
                <span className="font-semibold text-gray-50">{stats.totalReferrals}</span>
              </li>
              <li className="flex items-center justify-between p-2 bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <MdCheckCircle className="text-green-400 text-xl" /> Accepted
                </div>
                <span className="font-semibold text-gray-50">{stats.totalAccepted}</span>
              </li>
              <li className="flex items-center justify-between p-2 bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <MdPending className="text-yellow-400 text-xl" /> Pending
                </div>
                <span className="font-semibold text-gray-50">{stats.totalPending}</span>
              </li>
              <li className="flex items-center justify-between p-2 bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <MdGroup className="text-cyan-400 text-xl" /> Active This Week
                </div>
                <span className="font-semibold text-gray-50">{stats.activeUsers}</span>
              </li>
            </ul>
          ) : (
            <p className="text-gray-500 text-sm text-center mt-6">Loading statistics...</p>
          )}
        </aside>

        {/* CENTER FEED */}
        <div className="flex flex-col items-center gap-6">
          {filteredFeed.map((u, idx) => {
            const isLast = idx === filteredFeed.length - 1;

            return (
              // Original horizontal layout with dark polish
              <motion.div
                key={u._id}
                ref={isLast && !isSearching ? lastElementRef : null}
                className="flex flex-row items-center gap-4 bg-gray-800/25  border border-gray-700 rounded-2xl p-4 w-full max-w-xl transition-all duration-300  shadow-xl hover:shadow-primary/20"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.995 }}
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-primary/70 flex-shrink-0 shadow-md">
                  <motion.img
                    src={u.imageURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                  />
                </div>

                <div className="flex-1 ml-2 sm:ml-4">
                  <h3 className="text-lg sm:text-xl font-extrabold text-gray-50">
                    {u.firstName} {u.lastName}
                  </h3>

                  <p className="text-gray-400 text-sm mt-1">
                    <span className="font-medium text-gray-400">{u.headline}</span>
                    {u.company && <span className="text-gray-400"> @ {u.company}</span>}
                  </p>

                  <div className="mt-3 flex gap-3 justify-start">
                    <button
                      disabled={u.connectionStatus === "interested"}
                      onClick={() => handleSendRequest("interested", u._id)}
                      className={`px-3 py-2 text-sm rounded-lg font-semibold transition-all duration-200 ${
                        u.connectionStatus === "interested"
                          ? "bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600"
                          : "bg-primary text-white hover:bg-opacity-90 shadow-md shadow-primary/30"
                      }`}
                    >
                      {u.connectionStatus === "interested" ? "Requested" : "Connect"}
                    </button>

                    <button
                      onClick={() => openReferralModal(u)}
                      className="px-3 py-2 text-sm bg-gradient-to-r from-primary to-secondary rounded-lg text-white font-semibold hover:opacity-90 transition-opacity duration-200 shadow-md "
                    >
                      Ask Referral
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {loadingMore && <p className="text-gray-500 py-4">Loading more...</p>}
          {!hasMore && filteredFeed.length > 0 && (
            <p className="text-gray-500 py-4">You have reached the end of the list.</p>
          )}
          {filteredFeed.length === 0 && !loadingMore && !isSearching && (
            <p className="text-gray-500 py-12">No professionals found. Try a different search term.</p>
          )}
        </div>

        {/* RIGHT SIDEBAR — TESTIMONIALS (Desktop) */}
        <aside className="hidden lg:block bg-gray-800/25  border border-gray-700 rounded-2xl p-6 shadow-2xl h-fit">
          <h3 className="text-xl font-bold mb-5 text-secondary text-center">User Success Stories</h3>

          <div className="flex flex-col gap-5 text-gray-300">
            <div className="bg-gray-700/50 rounded-xl p-4 shadow-inner shadow-gray-900/50 border border-gray-700">
              <p className="italic text-sm text-gray-300">
                “I like how easy it is to reach out to developers from different companies. Landed my first
                FAANG interview through a connection here!”
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                  AS
                </div>
                <div>
                  <p className="text-sm font-semibold">Amit Sharma</p>
                  <p className="text-xs text-green-400">Software Developer @ Intel</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-700/50 rounded-xl p-4 shadow-inner shadow-gray-900/50 border border-gray-700">
              <p className="italic text-sm text-gray-300">
                “Clean interface, real people, and great opportunities. Highly recommended! The referral
                process is seamless.”
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                  NJ
                </div>
                <div>
                  <p className="text-sm font-semibold">Nikhil Joshi</p>
                  <p className="text-xs text-green-400">Software Engineer @ Odoo</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* REFERRAL MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/25 flex justify-center items-center z-50 px-4" // Darker overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="bg-gray-800/70 backdrop-blur-md border border-primary/50 shadow-3xl shadow-primary/20 p-8 rounded-3xl w-full max-w-md text-gray-50" // Dark Modal
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Ask {selectedUser?.firstName} for Referral
              </h3>

              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Job Link (URL)"
                  value={formData.jobLink}
                  onChange={(e) => setFormData({ ...formData, jobLink: e.target.value })}
                  className="px-4 py-3 rounded-xl bg-gray-700 text-gray-100 border border-gray-600 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
                />
                <input
                  type="text"
                  placeholder="Resume Link (URL)"
                  value={formData.resumeLink}
                  onChange={(e) => setFormData({ ...formData, resumeLink: e.target.value })}
                  className="px-4 py-3 rounded-xl bg-gray-700 text-gray-100 border border-gray-600 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="px-4 py-3 rounded-xl bg-gray-700 text-gray-100 border border-gray-600 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
                />
                <p className="text-xs text-gray-500 text-center mt-1">
                  Please ensure links are publicly accessible (e.g., Google Drive, Dropbox, LinkedIn).
                </p>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors border border-gray-600"
                >
                  Cancel
                </button>

                <button
                  onClick={handleReferralSubmit}
                  className="px-5 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold shadow-xl shadow-primary/40 hover:shadow-primary/60 transition-shadow"
                >
                  Send Request
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
