/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import logo from "../assests/latest_logo.svg";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { BaseURL } from "../constants/data";
import { Link, useNavigate } from "react-router-dom";
import { removeUser } from "../utils/userSlice";
import { BsPeople } from "react-icons/bs";
import { IoHomeOutline } from "react-icons/io5";
import { MdFollowTheSigns, MdOutlineKeyboardArrowDown, MdLogout } from "react-icons/md"; // Added icons
import { removeConnection } from "../utils/connectionSlice";
import { removeFeed } from "../utils/feedSlice";
import { motion } from "framer-motion";

const Navbar = () => {
  const user = useSelector((state) => state.user);
  const request = useSelector((state) => state.request);
  const requestCount = request?.length;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => setOpen((prev) => !prev);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  // --- Helper for Nav Links (Sleeker Look) ---
  const NavLink = ({ to, children, icon: Icon, badgeCount }) => {
    const content = (
      <motion.div
        whileHover={{ scale: 1.05, y: -2 }}
        className="flex items-center gap-2 py-2 px-3 text-gray-300 font-medium transition-colors duration-200 relative group"
      >
        <Icon className="text-xl text-primary" />
        <span className="group-hover:text-white transition-colors duration-200">{children}</span>
        {badgeCount > 0 && (
          <span className="absolute top-0 right-[-10px] w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full bg-secondary text-white">
            {badgeCount}
          </span>
        )}
        {/* Subtle hover gradient underline */}
        <span className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
      </motion.div>
    );

    return to ? <Link to={to}>{content}</Link> : content;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      // Updated dark theme: Richer background, slight blur, subtle shadow
      className="sticky top-0 z-50 bg-gray-950 backdrop-blur-md shadow-2xl shadow-black/50 px-4 py-2 flex justify-between items-center"
    >
      {/* Left: Logo */}
      <div className="flex items-center">
        <motion.img
          src={logo}
          alt="Logo"
          className="h-9 sm:h-11 cursor-pointer"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4 }}
          onClick={() => navigate("/")} // Make logo clickable
        />
      </div>

      {/* Center: Menu Links (Desktop) */}
      {user && (
        <div className="hidden lg:flex flex-1 justify-center items-center space-x-6">
          <NavLink to="/" icon={IoHomeOutline}>
            Feed
          </NavLink>

          {/* 🔽 Referral Requests Dropdown */}
          <div className="relative h-full flex items-center" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1 py-2 px-3 text-gray-300 font-medium hover:text-white transition-colors duration-200 group relative"
              onClick={toggleDropdown}
            >
              <MdFollowTheSigns className="text-xl text-primary" />
              <span>Referral Requests</span>
              <MdOutlineKeyboardArrowDown
                className={`ml-1 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
              />
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </motion.button>

            {open && (
              <motion.ul
                initial={{ opacity: 0, y: 10 }} // Changed y to push down, not up
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 p-2 rounded-xl bg-gray-800 border border-gray-700 shadow-2xl w-48 z-50 overflow-hidden"
              >
                <li className="p-1">
                  <button
                    className="w-full text-left py-2 px-3 rounded-lg text-gray-300 hover:bg-gray-700/70 hover:text-white transition-colors duration-150"
                    onClick={() => {
                      navigate("/referrals?view=received");
                      setOpen(false);
                    }}
                  >
                    Received Requests
                  </button>
                </li>
                <li className="p-1">
                  <button
                    className="w-full text-left py-2 px-3 rounded-lg text-gray-300 hover:bg-gray-700/70 hover:text-white transition-colors duration-150"
                    onClick={() => {
                      navigate("/referrals?view=sent");
                      setOpen(false);
                    }}
                  >
                    Sent Referrals
                  </button>
                </li>
              </motion.ul>
            )}
          </div>

          <NavLink to="/connections" icon={BsPeople}>
            Connections
          </NavLink>

          <NavLink to="/requests" icon={MdFollowTheSigns} badgeCount={requestCount}>
            Requests
          </NavLink>
        </div>
      )}

      {/* Right: User Info & Avatar Dropdown (Always visible) */}
      {user ? (
        <div className="flex items-center gap-3">
          <motion.p
            className="sm:block text-base font-bold bg-secondary bg-clip-text text-transparent drop-shadow-md"
            initial={{ x: 20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {firstName}
          </motion.p>

          {/* Avatar Dropdown */}
          <div className="dropdown dropdown-end">
            {" "}
            {/* Changed to dropdown-end for better mobile positioning */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar border-2 border-primary/70 hover:border-primary transition-colors duration-200"
            >
              <div className="w-11 rounded-full overflow-hidden">
                <img alt="User Avatar" src={imageURL} className="w-full h-full object-cover" />
              </div>
            </motion.div>
            {/* User Dropdown Menu */}
            <ul
              tabIndex={0}
              className="menu menu-md dropdown-content bg-gray-800 border border-gray-700 rounded-xl z-[1] w-56 p-2 shadow-2xl shadow-primary/10 mt-4"
            >
              {/* <li className="menu-title text-gray-400 border-b border-gray-700/50 mb-1">
                <img alt="User Avatar" src={imageURL} className="h-2 w-2" /> {firstName + "'s"} Account
              </li> */}
              <li>
                <Link to="/profile" className="justify-between text-gray-200 hover:bg-gray-700/70">
                  Profile
                  <span className="badge bg-primary text-white border-none">Edit</span>
                </Link>
              </li>
              <li>
                <Link to="/connections" className="text-gray-200 hover:bg-gray-700/70">
                  Connections
                </Link>
              </li>
              <li>
                <Link to="/requests" className="text-gray-200 hover:bg-gray-700/70">
                  Requests
                </Link>
              </li>
              {/* <li>
                <Link to="/blogs" className="text-gray-200 hover:bg-gray-700/70">
                  Blogs
                </Link>
              </li> */}
              <li>
                <Link to="/privacypolicy" className="text-gray-200 hover:bg-gray-700/70">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a
                  onClick={handleLogout}
                  className="text-red-400 hover:bg-red-900/40 hover:text-red-300 font-semibold"
                >
                  <MdLogout className="text-xl" />
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        // Login/Signup links if user is not logged in (Placeholder, adjust links as needed)
        <div className="flex items-center gap-4"></div>
      )}
    </motion.div>
  );
};

export default Navbar;
