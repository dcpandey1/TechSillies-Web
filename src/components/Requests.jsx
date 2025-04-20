import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequest, removeRequest } from "../utils/requestSlice";
import { BaseURL } from "../constants/data";
import { motion } from "framer-motion";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.request);

  const fetchRequests = async () => {
    if (requests) {
      return;
    } else {
      const res = await axios.get(BaseURL + "/user/requests/recieved", { withCredentials: true });
      dispatch(addRequest(res?.data?.connectionsRequests));
    }
  };

  const reviewRequest = async (status, requestId) => {
    try {
      await axios.post(
        BaseURL + "/review/request/" + status + "/" + requestId,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(requestId));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div>
      {!requests || requests.length === 0 ? (
        <motion.div
          className="flex justify-center items-center mt-16 px-4 py-8 sm:py-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center">
            <motion.img
              src="https://www.animatedimages.org/data/media/202/animated-dog-image-0712.gif"
              alt="Dog waiting for new users"
              className="w-48 h-48 sm:w-64 sm:h-64 object-contain mb-4 mx-auto block"
            />
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              You are all caught up !!
            </motion.h2>
            <motion.p
              className="mt-4 text-lg sm:text-xl md:text-4xl text-gray-400 text-shadow-lg text-shadow-blue-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              You do not have any requests right now. Come back later for more.
            </motion.p>
          </div>
        </motion.div>
      ) : (
        <section className="min-h-screen">
          <div className="py-8 px-4 mx-auto lg:py-12 lg:px-6">
            <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-8">
              <h2 className="mb-4 text-3xl tracking-tight font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Requests Received
              </h2>
            </div>
            <div className="grid gap-6 lg:gap-8 md:grid-cols-1">
              {requests.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center rounded-lg shadow-lg shadow-gray-950 w-160 mx-auto bg-slate-800/20 backdrop-blur-sm border-gray-700 p-4 sm:p-6"
                >
                  <a href="#">
                    <div className="w-28 h-28 sm:w-40 sm:h-40 aspect-square rounded-full overflow-hidden border-2 border-gray-500">
                      <img
                        className="w-full h-full object-cover"
                        src={user?.fromUserId?.imageURL}
                        alt="Avatar"
                      />
                    </div>
                  </a>

                  <div className="p-4">
                    <h3 className="text-lg font-bold tracking-tight">
                      <a href="#">{user?.fromUserId?.firstName + " " + user?.fromUserId?.lastName}</a>
                    </h3>
                    <p className="mt-2 text-sm font-light text-gray-400">{user?.fromUserId?.about}</p>
                    <div className="flex">
                      <p className="mt-2 text-sm font-light text-gray-400">
                        Expert In {user?.fromUserId?.skills?.join(", ")}
                      </p>
                    </div>
                    <div className="card-actions pt-4 flex flex-nowrap gap-4">
                      <button
                        onClick={() => reviewRequest("accept", user._id)}
                        className="btn bg-primary w-20 sm:w-32"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => reviewRequest("reject", user._id)}
                        className="btn bg-blue-800 w-20 sm:w-32"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Requests;
