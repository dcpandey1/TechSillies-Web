import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";
import { BaseURL } from "../constants/data";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ShimmerConnections from "./ShimmerConnections";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connection);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredConnections, setFilteredConnections] = useState([]);

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

  useEffect(() => {
    fetchConnection();
  }, []);

  // 🔍 Handle Search
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
            transition={{ duration: 0.3 }}
          >
            You have no connections, Connect with people from feed !!
          </motion.h2>
          <motion.p
            className="mt-4 text-lg sm:text-xl md:text-2xl text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            It looks like you do not have any connections right now. Try connecting with people from your
            feed.
          </motion.p>
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
      <div className="py-8 px-4 mx-auto lg:py-12 lg:px-6">
        {/* 🔹 Header */}
        <div className="mx-auto max-w-screen-sm text-center mb-6">
          <motion.h2
            className="mb-4 text-3xl tracking-tight font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Your Connections
          </motion.h2>

          {/* 🔍 Search Bar */}
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

        {/* 🔹 Connection Cards */}
        <motion.div
          className="flex flex-col gap-6 items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {filteredConnections.length === 0 ? (
            <p className="text-gray-400 mt-6 text-center">No connections found with that name.</p>
          ) : (
            filteredConnections.map((user) => (
              <motion.div
                key={user?._id}
                className="flex items-center rounded-xl border border-gray-700 shadow-2xl shadow-gray-900/70 w-[360px] sm:w-[450px] mx-auto bg-slate-800/25 backdrop-blur-sm p-4 sm:p-6 transition-all duration-300 hover:shadow-primary/40"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Profile Image */}
                <div className="w-28 h-28 sm:w-40 sm:h-40 aspect-square rounded-full overflow-hidden border-2 border-gray-500 flex-shrink-0">
                  <motion.img
                    className="w-full h-full object-cover"
                    src={user?.imageURL}
                    alt="Profile"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Info */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-base sm:text-lg font-bold tracking-tight text-white">
                      {user?.firstName + " " + (user?.lastName ? user?.lastName : "")}
                    </h3>
                    <Link to={"/chat/" + user?._id}>
                      <button className="px-4 py-1.5 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition">
                        Chat
                      </button>
                    </Link>
                  </div>

                  <p className="text-sm font-light text-gray-400">{user?.headline + " @ " + user?.company}</p>
                  {user?.skills?.length > 0 && (
                    <p className="mt-1 text-sm font-light text-blue-300">
                      Expert In {user?.skills?.join(", ")}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    {user?.updatedAt
                      ? `Connected on ${new Date(Date.parse(user?.updatedAt)).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          timeZone: "UTC",
                        })}`
                      : "Connection date unavailable"}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Connections;
