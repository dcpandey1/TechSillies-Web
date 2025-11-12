import { useDispatch, useSelector } from "react-redux";
import logo from "../assests/Untitled_logo.svg";
import axios from "axios";
import { useState } from "react";
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
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const toggleDropdown = () => setOpen((prev) => !prev);

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

  if (user) {
    var { imageURL, firstName } = user.user;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="navbar bg-gray-950 shadow-xl px-4 "
    >
      {/* Left: Logo */}
      <div className="flex-1">
        <motion.img
          src={logo}
          alt="Logo"
          className="h-10 sm:h-12"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Center: Menu Buttons */}
      {user && (
        <div className="hidden md:flex flex-1 justify-start space-x-4">
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="btn w-28 bg-white bg-opacity-0 backdrop-filter"
            >
              <IoHomeOutline />
              Feed
            </motion.button>
          </Link>

          {/* 🔽 Referral Requests Dropdown */}
          {/* 🔽 Referral Requests Dropdown */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="btn bg-white bg-opacity-0 flex items-center gap-2"
              onClick={toggleDropdown}
            >
              <MdFollowTheSigns />
              Referral Requests
            </motion.button>

            {open && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute mt-2 right-0 menu p-2 shadow bg-slate-800 rounded-box w-44 z-50"
              >
                <li>
                  <button
                    onClick={() => {
                      navigate("/referrals?view=received");
                      setOpen(false);
                    }}
                  >
                    Received
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      navigate("/referrals?view=sent");
                      setOpen(false);
                    }}
                  >
                    Sent
                  </button>
                </li>
              </motion.ul>
            )}
          </div>

          <Link to="/connections">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="btn w-auto bg-white bg-opacity-0 backdrop-filter"
            >
              <BsPeople />
              Connections
            </motion.button>
          </Link>
          <Link to="/requests">
            <div className="indicator">
              {(requestCount ?? 0) > 0 && (
                <span className="indicator-item badge bg-secondary mt-1 text-white">{requestCount}</span>
              )}
              <motion.button whileHover={{ scale: 1.05 }} className="btn bg-white bg-opacity-0">
                <MdFollowTheSigns />
                Requests
              </motion.button>
            </div>
          </Link>
        </div>
      )}

      {/* Right: User Info */}
      {user && (
        <div className="flex-none flex items-center gap-4">
          <motion.p
            className="sm:block text-base font-semibold bg-gradient-to-r from-secondary to-secondary bg-clip-text text-transparent drop-shadow-lg"
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
              <div className="w-12 rounded-full border-gray-500 border-2">
                <img alt="User Avatar" src={imageURL} />
              </div>
            </motion.div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-slate-800 rounded-box z-[1] ml-2 mt-10 sm:mt-10 w-52 shadow"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                  <span className="badge bg-primary">Edit</span>
                </Link>
              </li>
              <li>
                <Link to="/connections">Connections</Link>
              </li>
              <li>
                <Link to="/requests">Request</Link>
              </li>
              <li>
                <Link to="/blogs">Blogs</Link>
              </li>
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Navbar;
