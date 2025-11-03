import axios from "axios";
import { useDispatch } from "react-redux";
import { removeOneUserFromFeed } from "../utils/feedSlice";
import { BaseURL } from "../constants/data";
import { motion } from "framer-motion";

/* eslint-disable react/prop-types */
const UserCard = ({ user }) => {
  const { _id, firstName, lastName, about, skills, imageURL, createdAt, gender, company } = user;
  const dispatch = useDispatch();

  const handleAction = async (action, userId) => {
    try {
      await axios.post(`${BaseURL}/send/request/${action}/${userId}`, {}, { withCredentials: true });
      dispatch(removeOneUserFromFeed(userId));
    } catch (error) {
      console.error(error);
    }
  };

  const userCreatedDate = new Date(createdAt);
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const isNewUser = userCreatedDate > twoDaysAgo;

  return (
    <motion.div
      className="relative bg-slate-800/30 backdrop-blur-md shadow-xl shadow-gray-900 rounded-2xl w-full max-w-sm mx-auto p-6 flex flex-col items-center text-center transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
    >
      {isNewUser && (
        <div className="absolute top-3 right-3 bg-green-500/80 text-white text-xs font-semibold px-2 py-1 rounded-full">
          New
        </div>
      )}

      <figure className="flex justify-center mb-4">
        <motion.img
          src={imageURL}
          alt={firstName}
          className="rounded-full w-28 h-28 sm:w-40 sm:h-40 border-2 border-gray-300 object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
      </figure>

      <h2 className="text-lg sm:text-xl font-semibold text-white">
        {firstName} {lastName} {gender ? `(${gender})` : ""}
      </h2>

      {company && <p className="text-sm text-gray-300 mt-1">🏢 {company}</p>}

      <p className="mt-2 text-gray-400 text-sm line-clamp-3">{about}</p>

      {skills?.length > 0 && (
        <p className="mt-2 text-sm text-blue-300">
          <strong>Expert in:</strong> {skills.join(", ")}
        </p>
      )}

      <div className="flex justify-center gap-3 mt-5 w-full">
        <motion.button
          onClick={() => handleAction("connect", _id)}
          className="bg-primary text-white px-2 sm:px-6 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-base w-20 sm:w-auto hover:opacity-90 transition"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          Connect
        </motion.button>

        <motion.button
          onClick={() => handleAction("askReferral", _id)}
          className="bg-gradient-to-r from-primary to-secondary text-white px-2 sm:px-6 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-base w-24 sm:w-auto hover:opacity-90 transition"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          Ask Referral
        </motion.button>
      </div>
    </motion.div>
  );
};

export default UserCard;
