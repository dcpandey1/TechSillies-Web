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
        <div className="flex justify-center mt-10">
          <motion.h2
            className="text-3xl tracking-tight font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            You have no connections, Connect with people from feed !!
          </motion.h2>
        </div>
      ) : (
        <motion.section
          className="min-h-screen mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="py-8 px-4 mx-auto lg:py-12 lg:px-6">
            <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-12">
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
                  className="flex items-center rounded-lg shadow w-160 mx-auto bg-gray-800 border-gray-700 p-4 sm:p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <a href="#">
                    <motion.img
                      className="w-32 h-28 sm:w-40 sm:h-40 rounded-full object-cover border-white border-2"
                      src={user.imageURL}
                      alt="Profile"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </a>

                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold tracking-tight">
                        {user.firstName + " " + user.lastName}
                      </h3>
                      <Link to={"/chat/" + user._id}>
                        <button className="mr-0 btn btn-outline border-primary text-primary hover:bg-primary hover:text-white">
                          Chat
                        </button>
                      </Link>
                    </div>

                    <p className="mt-2 text-sm font-light text-gray-400">{user.about}</p>
                    <div className="flex">
                      <p className="mt-2 text-sm font-light text-gray-400">
                        Expert In {user?.skills?.join(", ")}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">
                      {user.updatedAt
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
