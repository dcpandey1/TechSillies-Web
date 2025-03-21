import axios from "axios";
import { BaseURL } from "../constants/data";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

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
      <div className="flex justify-center mt-10">
        <h2 className=" text-3xl tracking-tight font-extrabold bg-gradient-to-r from-primary  to-secondary bg-clip-text text-transparent">
          No More Users To Connect !!
        </h2>
      </div>
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
