import { useDispatch, useSelector } from "react-redux";
import logo from "../assests/ts_logo.svg";
import axios from "axios";
import { BaseURL } from "../constants/data";
import { Link, useNavigate } from "react-router-dom";
import { removeUser } from "../utils/userSlice";
import { BsPeople } from "react-icons/bs";
import { IoHomeOutline } from "react-icons/io5";
import { MdFollowTheSigns } from "react-icons/md";
import { removeConnection } from "../utils/connectionSlice";
import { removeFeed } from "../utils/feedSlice";
import { motion } from "framer-motion";

const Navbar = () => {
  const user = useSelector((state) => state.user);
  const request = useSelector((state) => state.request);
  const requestCount = request?.length;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (user) {
    var { imageURL, firstName } = user.user;
  }

  const handleLogout = async () => {
    try {
      await axios.post(BaseURL + "/signout", {}, { withCredentials: true });
      dispatch(removeUser());
      dispatch(removeConnection());
      dispatch(removeFeed());
      navigate("/login");
    } catch (error) {
      console.log("Error :" + error);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="navbar bg-gray-800 shadow-xl px-4"
      >
        {/* Left: Logo */}
        <div className="flex-1">
          <Link to="/">
            <motion.img
              src={logo}
              alt="Logo"
              className="h-10 sm:h-12"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4 }}
            />
          </Link>
        </div>

        {/* Center: Buttons */}
        {/* Right: Search + User Info */}
        {user && (
          <div className="hidden md:flex flex-1 justify-normal space-x-4">
            <Link to="/">
              <motion.button whileHover={{ scale: 1.05 }} className="btn w-28">
                <IoHomeOutline />
                Feed
              </motion.button>
            </Link>
            <Link to="/connections">
              <motion.button whileHover={{ scale: 1.05 }} className="btn w-auto">
                <BsPeople />
                Connections
              </motion.button>
            </Link>
            <Link to="/requests">
              <div className="indicator">
                {(requestCount ?? 0) > 0 && (
                  <span className="indicator-item badge bg-blue-600 mt-1">{requestCount}</span>
                )}

                <motion.button whileHover={{ scale: 1.05 }} className="btn">
                  <MdFollowTheSigns />
                  Requests
                </motion.button>
              </div>
            </Link>
          </div>
        )}

        {user && (
          <div className="flex-none flex items-center gap-4">
            {/* User Name */}
            <motion.p
              className="sm:block text-base font-semibold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent drop-shadow-lg"
              initial={{ x: 20 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {firstName}
            </motion.p>

            {/* Avatar Dropdown */}
            <div className="dropdown dropdown-left px-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-12 rounded-full border-white border-2">
                  <img alt="User Avatar" src={imageURL} />
                </div>
              </motion.div>

              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-200 rounded-box z-[1] ml-2 mt-10 sm:mt-10 w-52 shadow"
              >
                <li>
                  <Link to="/profile" className="justify-between">
                    Profile
                    <span className="badge bg-pink-800">New</span>
                  </Link>
                </li>
                <li>
                  <Link to="/connections">Connections</Link>
                </li>
                <li>
                  <Link to="/requests">Request</Link>
                </li>
                <li>
                  <a onClick={handleLogout}>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default Navbar;
