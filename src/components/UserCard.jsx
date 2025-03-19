import axios from "axios";
import { useDispatch } from "react-redux";
import { removeOneUserFromFeed } from "../utils/feedSlice";
import { BaseURL } from "../constants/data";
import { motion } from "framer-motion";

/* eslint-disable react/prop-types */
const UserCard = ({ user }) => {
  const { _id, firstName, lastName, about, skills, imageURL, createdAt } = user;

  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(BaseURL + "/send/request/" + status + "/" + userId, {}, { withCredentials: true });
      dispatch(removeOneUserFromFeed(userId));
    } catch (error) {
      console.log(error);
    }
  };

  const userCreatedDate = new Date(createdAt);
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const isNewUser = userCreatedDate > twoDaysAgo;

  return (
    <motion.div
      className="card bg-base-200 w-96 shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {isNewUser && (
        <motion.div
          className="text-pink-900 badge badge-soft m-4 bg-slate-200"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          New
        </motion.div>
      )}

      <figure className="px-10 pt-5">
        <motion.img
          src={imageURL}
          alt="Shoes"
          className="rounded-full w-56 h-56"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
      </figure>

      <motion.div
        className="card-body items-center text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="card-title">{firstName + " " + lastName}</h2>
        <p>{about}</p>

        <p>Expert In {skills.join(" ")}</p>
        <div className="card-actions flex flex-nowrap gap-4">
          <motion.button
            onClick={() => handleSendRequest("interested", _id)}
            className="btn bg-pink-800 w-32"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            Interested
          </motion.button>
          <motion.button
            onClick={() => handleSendRequest("ignore", _id)}
            className="btn bg-blue-800 w-32"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            Ignore
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserCard;
