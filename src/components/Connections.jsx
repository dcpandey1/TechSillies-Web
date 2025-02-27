import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";
import { BaseURL } from "../constants/data";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connection);
  const fetchConnection = async () => {
    const res = await axios.get(BaseURL + "/user/myConnections", { withCredentials: true });
    dispatch(addConnection(res.data.connections));
  };
  useEffect(() => {
    fetchConnection();
  }, []);
  return (
    <div>
      {!connections || connections.length === 0 ? (
        <div className="flex justify-center mt-10">
          <h2 className=" text-3xl tracking-tight font-extrabold bg-gradient-to-r from-pink-700  to-blue-700 bg-clip-text text-transparent">
            You have no connections, Connect with people from feed !!
          </h2>
        </div>
      ) : (
        <section className="bg-white dark:bg-gray-900 min-h-screen">
          <div className="py-8 px-4 mx-auto lg:py-12 lg:px-6">
            <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-12">
              <h2 className="mb-4 text-3xl tracking-tight font-extrabold bg-gradient-to-r from-pink-700  to-blue-700 bg-clip-text text-transparent">
                Your Connections
              </h2>
            </div>
            <div className="grid gap-6 lg:gap-8 md:grid-cols-1">
              {connections.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center bg-gray-50 rounded-lg shadow w-160 mx-auto dark:bg-gray-800 dark:border-gray-700 p-4 sm:p-6"
                >
                  <a href="#">
                    <img
                      className=" w-32 h-28 sm:w-40 sm:h-40 rounded-full object-cover"
                      src={user.imageURL}
                      alt="Bonnie Avatar"
                    />
                  </a>
                  <div className="p-4">
                    <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                      <a href="#">{user.firstName + " " + user.lastName}</a>
                    </h3>
                    {/* <span className="text-sm text-gray-500 dark:text-gray-400">CEO & Web Developer</span> */}
                    <p className="mt-2 text-sm font-light text-gray-500 dark:text-gray-400">{user.about}</p>
                    <div className="flex">
                      <p className="mt-2 text-sm font-light text-gray-500 dark:text-gray-400">
                        Expert In {user?.skills?.join(", ")}
                      </p>
                    </div>

                    <p className="text-sm text-gray-600">
                      {`Connected on ${new Date(user.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}`}
                    </p>
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

export default Connections;
