/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequest, removeRequest } from "../utils/requestSlice";
import { BaseURL } from "../constants/data";
import { motion, AnimatePresence } from "framer-motion";
import { MdFollowTheSigns, MdCheck, MdClose, MdWork, MdPerson } from "react-icons/md";
import toast from "react-hot-toast";
import { EmptyState } from "./EmptyState";
// Assuming EmptyState is available.

// =============================
// Helper Component: Request Card
// =============================
const RequestCard = ({ user, reviewRequest, loggedInFirstName }) => {
  const sender = user?.fromUserId;

  return (
    <motion.div
      key={user._id}
      // Card Container: Always display elements in a row, wrapping avatar and info block.
      // Use w-full max-w-lg for consistent sizing.
      className="flex flex-row items-start w-full max-w-lg mx-auto bg-gray-800/25 border border-gray-700 rounded-2xl p-4 shadow-xl hover:shadow-primary/20 transition-all duration-300"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      layout
    >
      {/* Avatar (Fixed Left Column) */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 mr-4 aspect-square rounded-full overflow-hidden border-2 border-primary/70 shadow-md">
        <motion.img
          className="w-full h-full object-cover"
          src={sender?.imageURL}
          alt="Avatar"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Info & Actions (Right Column, Flex-1) */}
      <div className="flex-1 w-full flex flex-col justify-between">
        <div className="text-left">
          {/* Name & Title */}
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <MdPerson className="text-secondary" />
            {sender?.firstName + " " + (sender?.lastName || "")}
          </h3>

          <p className="mt-0.5 text-sm font-medium text-secondary">{sender?.headline}</p>

          <p className="mt-0.5 text-xs font-light text-gray-400 flex items-center gap-1">
            <MdWork className="text-secondary" />@ {sender?.company || "N/A"}
          </p>

          {/* About snippet (reduced visibility on mobile) */}
          <p className="mt-2 text-xs text-gray-500 overflow-hidden line-clamp-2 hidden sm:block">
            {sender?.about || "The user has not added an about snippet yet."}
          </p>
        </div>

        {/* Action Buttons (Always Row) */}
        <div className="pt-3 flex flex-row flex-wrap gap-2 justify-start mt-2">
          <motion.button
            onClick={() => reviewRequest("accept", user._id)}
            // Primary color for acceptance
            className="flex items-center justify-center px-3 py-1.5 text-sm rounded-lg font-semibold transition-colors duration-200 bg-primary text-white hover:bg-opacity-90 shadow-md shadow-primary/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MdCheck className="mr-1 text-lg" /> Accept
          </motion.button>

          <motion.button
            onClick={() => reviewRequest("reject", user._id)}
            // Secondary dark color for rejection
            className="flex items-center justify-center px-3 py-1.5 text-sm rounded-lg font-semibold transition-colors duration-200 bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MdClose className="mr-1 text-lg" /> Reject
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.request);
  const loggedUser = useSelector((state) => state.user);
  const loggedInFirstName = loggedUser?.user?.firstName;

  // =============================
  // Fetch Requests Once
  // =============================
  const fetchRequests = async () => {
    if (requests && requests.length > 0) return;

    try {
      const res = await axios.get(BaseURL + "/user/requests/recieved", {
        withCredentials: true,
      });
      if (Array.isArray(res?.data?.connectionsRequests)) {
        dispatch(addRequest(res.data.connectionsRequests));
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load connection requests.");
    }
  };

  // =============================
  // Accept / Reject a Request
  // =============================
  const reviewRequest = async (status, requestId) => {
    const action = status === "accept" ? "Accepting" : "Rejecting";
    const toastId = toast.loading(`${action} request...`);

    try {
      await axios.post(`${BaseURL}/review/request/${status}/${requestId}`, {}, { withCredentials: true });
      dispatch(removeRequest(requestId));
      toast.success(`Request ${status}ed successfully!`, { id: toastId });
    } catch (error) {
      console.log(error);
      toast.error(`Failed to ${status} request.`, { id: toastId });
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
  // Empty State Component (Inline Placeholder)
  // =============================

  // =============================
  // MAIN RETURN
  // =============================
  return (
    <div className=" min-h-screen">
      {!requests || requests.length === 0 ? (
        <EmptyState message="No connection requests right now." />
      ) : (
        <motion.section
          className="py-8 px-4 mx-auto lg:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="py-3 px-4 mx-auto  lg:px-6">
            {/* Heading */}
            <motion.div
              className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="mb-4  text-2xl sm:text-3xl tracking-tight font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Requests Received ({requests.length})
              </h2>
            </motion.div>

            {/* List */}
            <motion.div
              className="grid gap-4 lg:gap-6 md:grid-cols-1"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
              }}
            >
              {/* Use AnimatePresence to handle the smooth removal of cards */}
              <AnimatePresence>
                {requests.map((user) => (
                  <RequestCard
                    key={user._id}
                    user={user}
                    reviewRequest={reviewRequest}
                    loggedInFirstName={loggedInFirstName}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default Requests;
