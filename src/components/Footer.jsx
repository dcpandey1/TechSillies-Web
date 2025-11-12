import { IoHomeOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BsPeople } from "react-icons/bs";
import { MdFollowTheSigns } from "react-icons/md";
// import { IoReader } from "react-icons/io5";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const Footer = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setOpen((prev) => !prev);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <>
      {user && (
        <div className="fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-700 p-2 flex justify-around md:hidden z-50">
          {/* Feed */}
          <Link to="/" className="flex flex-col items-center text-white hover:text-secondary">
            <IoHomeOutline className="text-lg" />
            <span className="text-xs">Feed</span>
          </Link>

          {/* Referral Requests Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex flex-col items-center text-white hover:text-secondary focus:outline-none"
            >
              <MdFollowTheSigns className="text-lg" />
              <span className="text-xs">Referrals</span>
            </button>

            {open && (
              <motion.ul
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-slate-800 border border-gray-700 rounded-lg shadow-lg p-2 w-32 text-sm text-white"
              >
                <li>
                  <button
                    onClick={() => {
                      navigate("/referrals?view=received");
                      setOpen(false);
                    }}
                    className="w-full text-left px-2 py-1 hover:bg-slate-700 rounded-md"
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
                    className="w-full text-left px-2 py-1 hover:bg-slate-700 rounded-md"
                  >
                    Sent
                  </button>
                </li>
              </motion.ul>
            )}
          </div>
          {/* Connections */}

          <Link to="/connections" className="flex flex-col items-center text-white hover:text-secondary">
            <BsPeople className="text-lg" />
            <span className="text-xs">Connections</span>
          </Link>

          {/* Requests */}
          <Link to="/requests" className="flex flex-col items-center text-white hover:text-secondary">
            <MdFollowTheSigns className="text-lg" />
            <span className="text-xs">Requests</span>
          </Link>

          {/* Blogs */}
          {/* <Link to="/blogs" className="flex flex-col items-center text-white hover:text-secondary">
            <IoReader className="text-lg" />
            <span className="text-xs">Blogs</span>
          </Link> */}
        </div>
      )}
    </>
  );
};

export default Footer;
