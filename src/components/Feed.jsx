import axios from "axios";
import { BaseURL } from "../constants/data";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";
import { motion } from "framer-motion";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);

  const fetchFeed = async () => {
    if (feed) {
      return;
    }
    const res = await axios.get(BaseURL + "/user/feed", { withCredentials: true });
    dispatch(addFeed(res?.data?.feedUsers));
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  if (!feed) {
    return;
  }

  if (feed.length <= 0) {
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
            No More Users To Connect !!
          </motion.h2>
          <motion.p
            className="mt-4 text-lg sm:text-xl md:text-2xl text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            It looks like you are all caught up! Come back later for new users to connect with.
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return (
    feed && (
      <div className="flex justify-center mt-4 sm:mt-16 mx-4 mb-16">
        <UserCard user={feed[0]} />
      </div>
    )
  );
};

export default Feed;
