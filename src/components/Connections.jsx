/* eslint-disable no-unused-vars */
import axios from "axios";
import { useEffect, useState, useCallback } from "react"; // Added useCallback
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";
import { BaseURL } from "../constants/data";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { MdSearch, MdClose, MdChat, MdWork, MdPerson } from "react-icons/md";
import toast from "react-hot-toast";

// Placeholder for isValidUrl (assuming availability)
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

// Placeholder for ShimmerConnections (assuming availability)
const ShimmerConnections = () => (
  <div className="pt-10 px-4  min-h-screen">
    <p className="text-center text-xl font-semibold text-gray-500 mb-8">Loading Connections...</p>
    <div className="flex flex-col items-center gap-6 max-w-xl mx-auto">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex flex-row items-center gap-5 rounded-xl border border-gray-700 shadow-lg w-full bg-gray-800/70 p-4 animate-pulse"
        >
          <div className="w-24 h-24 rounded-full bg-gray-700 flex-shrink-0"></div>
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            <div className="h-3 bg-gray-700 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connection);
  const loggedUser = useSelector((state) => state.user);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredConnections, setFilteredConnections] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    jobLink: "",
    resumeLink: "",
    email: "",
  });

  const fetchConnection = async () => {
    if (connections && connections.length > 0) {
      setFilteredConnections(connections);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(BaseURL + "/user/myConnections", {
        withCredentials: true,
      });
      dispatch(addConnection(res.data.connections));
      setFilteredConnections(res.data.connections);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load your connections.");
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  // FIX 1: Use useCallback for handleSearch so it can be called reliably
  const handleSearch = useCallback(() => {
    if (!searchTerm.trim() || !connections) {
      setFilteredConnections(connections || []);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = connections.filter(
      (user) => user?.firstName?.toLowerCase().includes(term) || user?.lastName?.toLowerCase().includes(term)
    );
    setFilteredConnections(filtered);
  }, [searchTerm, connections]);

  // Sync internal filter state when component mounts or Redux connections change
  useEffect(() => {
    fetchConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Rerun search whenever the connections list updates (e.g., after initial fetch)
  useEffect(() => {
    handleSearch();
  }, [connections, handleSearch]); // Dependency array includes handleSearch which depends on searchTerm

  const openReferralModal = (u) => {
    setSelectedUser(u);
    setFormData({
      jobLink: "",
      resumeLink: "",
      email: loggedUser?.user?.email || "",
    });
    setShowModal(true);
  };

  const handleReferralSubmit = async () => {
    const { jobLink, resumeLink, email } = formData;

    if (!jobLink || !resumeLink || !email) return toast.error("Please fill all required fields.");

    if (!isValidUrl(jobLink)) return toast.error("Enter a valid job link (URL).");
    if (!isValidUrl(resumeLink)) return toast.error("Enter a valid resume link (URL).");

    const toastId = toast.loading(`Sending referral request to ${selectedUser.firstName}...`);

    try {
      await axios.post(
        `${BaseURL}/referral/send/${selectedUser._id}`,
        { jobLink, resumeLink },
        { withCredentials: true }
      );

      toast.success(`Referral request sent to ${selectedUser.firstName} successfully!`, { id: toastId });
      setShowModal(false);
    } catch (err) {
      const errMsg = err.response?.data?.error || "Failed to send request. Try again.";
      toast.error(errMsg, { id: toastId });
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setFilteredConnections(connections);
  };

  if (loading) return <ShimmerConnections />;

  if (!connections || connections.length === 0) {
    return (
      <motion.div
        className="flex justify-center items-center min-h-screen px-4 py-16"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center max-w-lg p-8 bg-gray-800/25 border border-gray-700 rounded-xl shadow-2xl">
          <motion.h2
            className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            Expand Your Network!
          </motion.h2>
          <p className="mt-4 text-gray-400 text-lg">
            You have not connected with anyone yet. Head over to the feed to start building your professional
            network.
          </p>
          <Link to="/">
            <button className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-md hover:opacity-90 transition-opacity">
              Go to Feed
            </button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.section
      className="min-h-screen  pb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="py-8 px-4 mx-auto lg:py-8 lg:px-6">
        {/* Header */}
        <div className="mx-auto max-w-screen-sm text-center mb-6">
          <motion.h2
            className="mb-4 text-4xl tracking-tight font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Your Connections ({connections.length})
          </motion.h2>

          {/* Search Bar (Premium Style) */}
          <div className="flex justify-center px-2">
            <div className="flex gap-2 w-full max-w-md bg-gray-800/25 backdrop-blur-sm rounded-xl p-1 border border-primary/40 shadow-xl shadow-primary/10">
              <div className="flex-grow flex items-center">
                <MdSearch className="text-primary text-2xl mx-2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  className="flex-grow bg-transparent text-gray-100 placeholder-gray-400 py-2 focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                />
                {searchTerm && (
                  <button
                    onClick={handleClearSearch}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors duration-200"
                  >
                    <MdClose className="text-xl" />
                  </button>
                )}
              </div>

              <button
                onClick={handleSearch}
                type="button" // FIX 2: Ensure button type is defined
                className="px-4 py-2 bg-gradient-to-r from-primary to-secondary rounded-lg text-white font-semibold flex-shrink-0 hover:opacity-90 transition-opacity duration-200 shadow-md shadow-primary/30"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Connections List */}
        <motion.div
          className="flex flex-col gap-5 items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {filteredConnections.length === 0 ? (
            <p className="text-gray-400 mt-6 p-4 bg-gray-800/25 rounded-xl border border-gray-700">
              No connections found matching {searchTerm}.
            </p>
          ) : (
            filteredConnections.map((user) => (
              <motion.div
                key={user?._id}
                className="flex flex-row items-center gap-5 rounded-2xl border border-gray-700 shadow-xl w-full max-w-xl bg-gray-800/25 p-4 hover:shadow-primary/40 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Profile Image */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-primary/70 flex-shrink-0 shadow-md">
                  <motion.img
                    src={user?.imageURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                  />
                </div>

                {/* Right Section */}
                <div className="flex flex-col justify-start text-left w-full">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <MdPerson className="text-secondary" />
                    {user?.firstName} {user?.lastName}
                  </h3>

                  {user?.company && (
                    <h5 className="text-sm font-semibold text-gray-400 flex items-center gap-1 mt-1">
                      <MdWork className="text-primary" /> Works @ {user.company}
                    </h5>
                  )}

                  <p className="text-xs text-gray-500 mt-2">
                    {user?.updatedAt
                      ? `Connected on ${new Date(Date.parse(user?.updatedAt)).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          timeZone: "UTC",
                        })}`
                      : "Connection date unavailable"}
                  </p>

                  {/* Buttons Row */}
                  <div className="flex gap-2 mt-4">
                    <Link to={`/chat/${user?._id}`}>
                      <button className="px-4 py-2 text-sm rounded-lg text-white bg-gray-700 font-semibold hover:bg-gray-600 transition flex items-center gap-1">
                        <MdChat className="text-lg" /> Chat
                      </button>
                    </Link>

                    <button
                      onClick={() => openReferralModal(user)}
                      type="button"
                      className="px-4 py-1 text-xs rounded-lg border border-primary text-white bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition flex items-center gap-1"
                    >
                      Ask For Referral
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* REFERRAL MODAL (Styled to match dark theme) */}
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

export default Connections;
