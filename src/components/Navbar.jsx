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
      await axios.post(BaseURL + "signout", {}, { withCredentials: true });
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
      <div className="navbar bg-gray-800 shadow-xl px-4">
        {/* Left: Logo */}
        <div className="flex-1">
          <Link to="/">
            <img className="h-10 sm:h-12" src={logo} alt="Logo" />
          </Link>
        </div>

        {/* Center: Buttons */}

        {/* Right: Search + User Info */}

        {user && (
          <div className="hidden md:flex flex-1 justify-center space-x-4 ">
            <Link to="/">
              <button className="btn w-28">
                <IoHomeOutline />
                Feed
              </button>
            </Link>
            <Link to="/connections">
              <button className="btn  w-auto">
                <BsPeople />
                Connections
              </button>
            </Link>
            <Link to="/requests">
              <div className="indicator">
                {(requestCount ?? 0) > 0 && (
                  <span className="indicator-item badge bg-blue-600 mt-1">{requestCount}</span>
                )}

                <button className="btn ">
                  <MdFollowTheSigns />
                  Requests
                </button>
              </div>
            </Link>
          </div>
        )}

        {user && (
          <div className="flex-none flex items-center gap-4">
            <div className="form-control">
              <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
            </div>

            <p className="hidden sm:block">{firstName}</p>
            <div className="dropdown dropdown-left px-2">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img alt="User Avatar" src={imageURL} />
                </div>
              </div>

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
                  <Link to="/connections">Settings</Link>
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
      </div>
    </>
  );
};

export default Navbar;
