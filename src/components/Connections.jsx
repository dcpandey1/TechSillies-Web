import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";
import { BaseURL } from "../constants/data";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import ShimmerConnections from "./ShimmerConnections";
import { isValidUrl } from "../utils/isValidURLS";

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
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  const openReferralModal = (u) => {
    setSelectedUser(u);
    setFormData({
      jobLink: "",
      resumeLink: "",
      email: loggedUser?.user?.email || "",
    });
    setShowModal(true);
  };

  useEffect(() => {
    fetchConnection();
  }, []);

  // 🔍 Search by name
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredConnections(connections);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = connections.filter(
      (user) => user?.firstName?.toLowerCase().includes(term) || user?.lastName?.toLowerCase().includes(term)
    );
    setFilteredConnections(filtered);
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

  const handleClearSearch = () => {
    setSearchTerm("");
    setFilteredConnections(connections);
  };

  if (loading) return <ShimmerConnections />;

  if (!connections || connections.length === 0) {
    return (
      <motion.div
        className="flex justify-center items-center mt-16 px-4 py-8 sm:py-16"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            You have no connections, Connect with people from feed !!
          </motion.h2>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.section
      className="min-h-screen mb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="py-8 px-4 mx-auto lg:py-8 lg:px-6">
        {/* Header */}
        <div className="mx-auto max-w-screen-sm text-center mb-6">
          <motion.h2
            className="mb-4 text-3xl tracking-tight font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Your Connections
          </motion.h2>

          {/* Search */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-4 w-full max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search by name..."
              className="flex-grow min-w-[100px] px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/50 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button
              onClick={handleSearch}
              className="px-4 py-2 rounded-xl bg-primary text-gray-100 font-semibold hover:scale-105 transition-transform"
            >
              Search
            </button>

            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="px-4 py-2 rounded-xl bg-slate-700 text-gray-300 font-semibold hover:bg-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Connections List */}
        <motion.div
          className="flex flex-col gap-6 items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {filteredConnections.length === 0 ? (
            <p className="text-gray-400 mt-6">No connections found.</p>
          ) : (
            filteredConnections.map((user) => (
              <motion.div
                key={user?._id}
                className="flex flex-row items-center gap-5 rounded-xl border border-gray-700 shadow-2xl w-full max-w-xl bg-slate-800/25 p-4 hover:shadow-primary/40 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Profile Image */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-gray-500 flex-shrink-0">
                  <motion.img
                    src={user?.imageURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                  />
                </div>

                {/* Right Section */}
                <div className="flex flex-col justify-start text-left w-full">
                  <h3 className="text-xl font-bold text-white">
                    {user?.firstName} {user?.lastName}
                  </h3>

                  {user?.company && (
                    <h5 className="text-sm font-semibold text-gray-400">Works @ {user.company}</h5>
                  )}

                  <p className="text-xs text-gray-500 mt-1">
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
                  <div className="flex gap-3 mt-4">
                    <Link to={`/chat/${user?._id}`}>
                      <button className="px-4 py-2 text-sm rounded-lg text-white bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition">
                        Chat
                      </button>
                    </Link>

                    <button
                      onClick={() => openReferralModal(user)}
                      className="px-2 sm:px-4 py-2 text-sm  rounded-lg border border-primary text-white bg-primary hover:text-white transition"
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

      {/* REFERRAL MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700  shadow-xl p-6 rounded-2xl w-full max-w-md">
              <h3 className="text-xl font-bold mb-4 text-center text-gray-300">
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

export default Connections;
