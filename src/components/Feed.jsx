import axios from "axios";
import { BaseURL } from "../constants/data";
import { MdGroup, MdCheckCircle, MdPending, MdRocketLaunch } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef, useCallback } from "react";
import { updateUserStatus } from "../utils/feedSlice";
import { motion, AnimatePresence } from "framer-motion";
import { isValidUrl } from "../utils/isValidURLS";

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

  // Fetch Stats
  const fetchStats = async () => {
    try {
      const res = await axios.get(`${BaseURL}/stats`, { withCredentials: true });
      setStats(res.data);
    } catch (error) {
      console.error("Stats fetch error:", error);
    }
  };

  // Load feed (20 per page)
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

  // Infinite scroll observer
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

  // Search
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

  // Send connect request
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

  // Referral Modal
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

  return (
    <motion.section
      className="min-h-screen py-8 px-4 md:px-8 lg:px-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* SEARCH HEADER */}
      <div className="text-center mb-10">
        <h2 className="mb-4 text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Suggested Connections
        </h2>

        {/* Search */}
        <div className="flex justify-center gap-2 max-w-xl mx-auto">
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
      </div>

      {/* 3 COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_260px] gap-8 lg:gap-12">
        {/* LEFT SIDEBAR — STATS */}
        <aside className="hidden lg:block bg-slate-900/60 border border-slate-700 rounded-2xl p-5 shadow-xl h-fit">
          <h3 className="text-xl font-bold mb-4 text-secondary text-center">Insights</h3>

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
                <span>{stats.totalPending}</span>
              </li>

              <li className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MdGroup className="text-cyan-400 text-xl" /> Active This Week
                </div>
                <span>{stats.activeUsers}</span>
              </li>
            </ul>
          ) : (
            <p className="text-gray-500 text-sm text-center mt-6">Loading...</p>
          )}
        </aside>

        {/* CENTER FEED */}
        <div className="flex flex-col items-center gap-8">
          {filteredFeed.map((u, idx) => {
            const isLast = idx === filteredFeed.length - 1;

            return (
              <motion.div
                key={u._id}
                ref={isLast && !isSearching ? lastElementRef : null}
                className="flex flex-col sm:flex-row items-center bg-slate-800/25 border border-gray-700 rounded-2xl p-5 w-full max-w-xl"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-gray-600 flex-shrink-0">
                  <motion.img
                    src={u.imageURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                  />
                </div>

                <div className="sm:ml-6 mt-3 text-center sm:text-left w-full">
                  <h3 className="text-xl font-bold text-gray-100">
                    {u.firstName} {u.lastName}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {u.headline} {u.company && `@ ${u.company}`}
                  </p>

                  <div className="mt-4 flex gap-3 justify-center sm:justify-start">
                    <button
                      disabled={u.connectionStatus === "interested"}
                      onClick={() => handleSendRequest("interested", u._id)}
                      className={`px-4 py-2 rounded-xl ${
                        u.connectionStatus === "interested"
                          ? "bg-gray-500 opacity-50 cursor-not-allowed"
                          : "bg-primary"
                      }`}
                    >
                      {u.connectionStatus === "interested" ? "Requested" : "Connect"}
                    </button>

                    <button
                      onClick={() => openReferralModal(u)}
                      className="px-4 py-2 bg-gradient-to-r from-primary to-secondary rounded-xl text-gray-100"
                    >
                      Ask Referral
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {loadingMore && <p className="text-gray-500 py-4">Loading more...</p>}
        </div>

        {/* RIGHT SIDEBAR — TESTIMONIALS */}
        <aside className="hidden lg:block bg-slate-800/25 border border-gray-700 rounded-2xl p-5 shadow-2xl h-fit">
          <h3 className="text-xl font-bold mb-4 text-secondary text-center">What Users Say</h3>

          <div className="flex flex-col gap-5 text-gray-300">
            <div className="bg-slate-800/50 rounded-xl p-4 shadow-md">
              <p className="italic text-sm">
                “I like how easy it is to reach out to developers from different companies.”
              </p>
              <div className="mt-3 flex items-center gap-3">
                {/* <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  className="w-10 h-10 rounded-full border"
                /> */}
                <div>
                  <p className="text-sm font-semibold">Amit Sharma</p>
                  <p className="text-xs text-green-700">Software Developer @ Intel</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-80/50 rounded-xl p-4 shadow-md">
              <p className="italic text-sm">
                “Clean interface, real people, and great opportunities. Highly recommended!”
              </p>
              <div className="mt-3 flex items-center gap-3">
                {/* <img
                  src="https://randomuser.me/api/portraits/men/37.jpg"
                  className="w-10 h-10 rounded-full border"
                /> */}
                <div>
                  <p className="text-sm font-semibold">Nikhil Joshi</p>
                  <p className="text-xs text-green-700">Software Engineer @ Odoo</p>
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
            className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-slate-900 p-6 rounded-2xl w-full max-w-md">
              <h3 className="text-xl font-bold mb-4 text-center">
                Ask {selectedUser?.firstName} for Referral
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
                <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-700 rounded-lg">
                  Cancel
                </button>

                <button onClick={handleReferralSubmit} className="px-4 py-2 bg-primary rounded-lg">
                  Submit
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default Feed;
