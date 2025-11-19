import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequest, removeRequest } from "../utils/requestSlice";
import { BaseURL } from "../constants/data";
import { motion } from "framer-motion";
import { EmptyState } from "./EmptyState";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.request);

  // =============================
  // Fetch Requests Once
  // =============================
  const fetchRequests = async () => {
    if (requests) return;

    try {
      const res = await axios.get(BaseURL + "/user/requests/recieved", {
        withCredentials: true,
      });
      dispatch(addRequest(res?.data?.connectionsRequests));
    } catch (error) {
      console.log(error);
    }
  };

  // =============================
  // Accept / Reject a Request
  // =============================
  const reviewRequest = async (status, requestId) => {
    try {
      await axios.post(`${BaseURL}/review/request/${status}/${requestId}`, {}, { withCredentials: true });
      dispatch(removeRequest(requestId));
    } catch (error) {
      console.log(error);
    }
  };

  // =============================
  // Load data on mount
  // =============================
  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =============================
  // Empty State (inline, with cute dog SVG)
  // =============================

  // =============================
  // MAIN RETURN
  // =============================
  return (
    <div>
      {!requests || requests.length === 0 ? (
        <EmptyState message="No connection requests right now." />
      ) : (
        <motion.section
          className="min-h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="py-8 px-4 mx-auto lg:py-12 lg:px-6">
            {/* Heading */}
            <motion.div
              className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="mb-4 text-3xl tracking-tight font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Requests Received
              </h2>
            </motion.div>

            {/* List */}
            <motion.div
              className="grid gap-6 lg:gap-8 md:grid-cols-1"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.2 } },
              }}
            >
              {requests.map((user) => (
                <motion.div
                  key={user._id}
                  className="flex items-center rounded-lg shadow-lg shadow-gray-950 w-160 mx-auto bg-slate-800/20 backdrop-blur-sm border-gray-700 p-4 sm:p-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <a href="#">
                    <div className="w-28 h-28 sm:w-40 sm:h-40 aspect-square rounded-full overflow-hidden border-2 border-gray-500">
                      <motion.img
                        className="w-full h-full object-cover"
                        src={user?.fromUserId?.imageURL}
                        alt="Avatar"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </a>

                  <div className="p-4">
                    <h3 className="text-lg font-bold tracking-tight">
                      {user?.fromUserId?.firstName + " " + (user?.fromUserId?.lastName || "")}
                    </h3>

                    <p className="mt-2 text-sm font-light text-gray-400">{user?.fromUserId?.about}</p>

                    <p className="mt-2 text-sm font-light text-gray-400">
                      Expert In {user?.fromUserId?.skills?.join(", ")}
                    </p>

                    <div className="card-actions pt-4 flex flex-nowrap gap-4">
                      <button
                        onClick={() => reviewRequest("accept", user._id)}
                        className="btn bg-primary w-20 sm:w-32 text-white"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() => reviewRequest("reject", user._id)}
                        className="btn bg-gradient-to-r from-primary to-secondary w-20 sm:w-32 text-white"
                      >
                        Reject
                      </button>
                    </div>
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

export default Requests;
