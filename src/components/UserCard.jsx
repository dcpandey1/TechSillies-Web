import axios from "axios";
import { useDispatch } from "react-redux";
import { removeOneUserFromFeed } from "../utils/feedSlice";

/* eslint-disable react/prop-types */
const UserCard = ({ user }) => {
  const { _id, firstName, lastName, about, skills, imageURL } = user;

  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        "http://localhost:3000/send/request/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeOneUserFromFeed(userId));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="card bg-base-200 w-96 shadow-xl">
      <figure className="px-10 pt-5">
        <img src={imageURL} alt="Shoes" className="rounded-full w-56 h-56" />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title">{firstName + " " + lastName}</h2>
        <p>{about}</p>
        <p>Expert In {skills.join(" ")}</p>
        <div className="card-actions">
          <button onClick={() => handleSendRequest("interested", _id)} className="btn bg-pink-800 w-32">
            Interested
          </button>
          <button onClick={() => handleSendRequest("ignore", _id)} className="btn bg-blue-800 w-32">
            Ignore
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
