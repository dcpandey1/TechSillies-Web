import axios from "axios";
import { BaseURL } from "../constants/data";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addFeed, removeOneUserFromFeed } from "../utils/feedSlice";
import { motion, AnimatePresence } from "framer-motion";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const user = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFeed, setFilteredFeed] = useState([]);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    jobLink: "",
    resumeLink: "",
    email: "",
  });

  // Fetch feed once
  const fetchFeed = async () => {
    if (feed && feed.length > 0) {
      setFilteredFeed(feed);
      return;
    }
    try {
      const res = await axios.get(BaseURL + "/user/feed", { withCredentials: true });
      dispatch(addFeed(res?.data?.feedUsers));
      setFilteredFeed(res?.data?.feedUsers);
    } catch (error) {
      console.error("Error fetching feed:", error);
    }
  };

  useEffect(() => {
    fetchFeed();
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

  // 🔍 Search and Clear Handlers
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

  // Modal handlers
  const openReferralModal = (selected) => {
    setSelectedUser(selected);
    setFormData({
      jobLink: "",
      resumeLink: "",
      email: user?.user?.email || "", // use logged-in user's email
    });
    setShowModal(true);
  };

  const handleReferralSubmit = () => {
    const { jobLink, resumeLink, email } = formData;
    if (!jobLink || !resumeLink || !email) {
      alert("Please fill all fields before submitting.");
      return;
    }
    alert(`Referral request sent to ${selectedUser.firstName}`);
    setShowModal(false);
  };

  if (!feed) return null;

  if (feed.length === 0) {
    return (
      <motion.div
        className="flex justify-center items-center mt-16 px-4 py-8 sm:py-16"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <motion.img
            src="https://www.animatedimages.org/data/media/202/animated-dog-image-0712.gif"
            alt="No users"
            className="w-48 h-48 sm:w-64 sm:h-64 object-contain mb-4 mx-auto"
          />
          <motion.h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-secondary">
            No More Users To Connect !!
          </motion.h2>
          <p className="mt-4 text-lg sm:text-xl md:text-2xl text-gray-400">
            Come back later for new users to connect with.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.section
      className="min-h-screen mb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="py-8 px-4 mx-auto max-w-3xl lg:py-12">
        {/* Header Section */}
        <div className="mx-auto text-center mb-8">
          <motion.h2 className="mb-4 text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Suggested Connections
          </motion.h2>

          {/* 🔍 Search Bar + Buttons */}
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

        {/* User Feed */}
        <div className="flex flex-col gap-8 items-center">
          {filteredFeed.length === 0 ? (
            <p className="text-gray-400 mt-6 text-center">No users found for that company.</p>
          ) : (
            filteredFeed.map((user, idx) => (
              <motion.div
                key={user._id}
                className="flex flex-col sm:flex-row items-center bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl shadow-lg shadow-black/50 p-5 sm:p-6 w-full max-w-xl hover:shadow-primary/40 transition-shadow duration-300"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
              >
                {/* Profile Image */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-gray-600 flex-shrink-0">
                  <motion.img
                    src={user.imageURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* User Info */}
                <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left w-full">
                  <h3 className="text-xl font-bold text-gray-100">
                    {user.firstName} {user.lastName || ""}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {user.headline} @ <span className="text-gray-300 font-medium">{user.company}</span>
                  </p>

                  {user.skills && user.skills.length > 0 && (
                    <p className="mt-2 text-sm text-gray-400">
                      <span className="text-gray-500">Expert in:</span> {user.skills.join(", ")}
                    </p>
                  )}

                  {/* Buttons */}
                  <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
                    <motion.button
                      className="px-4 py-2 text-sm sm:text-base rounded-xl bg-primary text-gray-300 font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-200"
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleSendRequest("interested", user._id)}
                    >
                      Connect
                    </motion.button>

                    <motion.button
                      className="px-4 py-2 text-sm sm:text-base rounded-xl bg-gradient-to-r from-primary to-secondary text-gray-100 font-semibold shadow-md transition-transform duration-200"
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
      </div>

      {/* 🔹 Referral Modal */}
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
