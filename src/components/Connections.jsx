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
  const [loading, setLoading] = useState(true); // Track loading state

  const fetchConnection = async () => {
    if (connections) {
      setLoading(false);
      return;
    }
    const res = await axios.get(BaseURL + "/user/myConnections", { withCredentials: true });
    dispatch(addConnection(res.data.connections));
    setTimeout(() => setLoading(false), 800);
  };

  useEffect(() => {
    fetchConnection();
  }, [connections]);

  return (
    <div>
      {loading ? (
        <ShimmerConnections /> // Show shimmer effect while data is loading
      ) : !connections || connections.length === 0 ? (
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
      ) : (
        <motion.section
          className="min-h-screen mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="py-8 px-auto mx-auto lg:py-12 lg:px-6">
            <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-8">
              <motion.h2
                className="mb-4 text-3xl tracking-tight font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                Your Connections
              </motion.h2>
            </div>

            <motion.div
              className="grid gap-6 lg:gap-8 md:grid-cols-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {connections.map((user) => (
                <motion.div
                  key={user._id}
                  className="flex items-center rounded-lg shadow-lg shadow-gray-950 w-[360px] sm:w-[450px] mx-auto bg-slate-800/20 backdrop-blur-sm border-slate-800 p-4 sm:p-6 "
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <a href="#">
                    <div className="w-28 h-28 sm:w-40 sm:h-40 aspect-square rounded-full overflow-hidden border-2 border-gray-500 flex-shrink-0">
                      <motion.img
                        className="w-full h-full object-cover"
                        src={user?.imageURL}
                        alt="Profile"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </a>

                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold tracking-tight">
                        {user?.firstName + " " + (user?.lastName ? user?.lastName : "")}
                      </h3>
                      <Link to={"/chat/" + user._id}>
                        <button className="mr-0 btn   text-gray-300 bg-gradient-to-r from-primary to-secondary hover:text-white">
                          Chat
                        </button>
                      </Link>
                    </div>

                    <p className="mt-2 text-sm font-light text-gray-400 text-wrap">{user?.about}</p>
                    <div className="flex">
                      <p className="mt-2 text-sm font-light text-gray-400">
                        Expert In {user?.skills?.join(", ")}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 text-wrap">
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
              ))}
            </motion.div>
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default Connections;
