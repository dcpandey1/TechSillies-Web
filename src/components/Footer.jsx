import { IoHomeOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BsPeople } from "react-icons/bs";
import { MdFollowTheSigns } from "react-icons/md";

const Footer = () => {
  const user = useSelector((state) => state.user);
  return (
    <>
      {/* For large devices (hidden on mobile) */}

      {/* For mobile devices (hidden on large screens) */}
      {user && (
        <div className="fixed bottom-0 left-0 w-full bg-gray-800 border-t border-gray-300 p-2 flex justify-around md:hidden">
          <Link to="/">
            <button className="flex flex-col items-center text-white hover:text-black">
              <IoHomeOutline />
              <span className="text-sm text-white">Feed</span>
            </button>
          </Link>
          <Link to="/connections">
            <button className="flex flex-col items-center text-white hover:text-black">
              <BsPeople />
              <span className="text-sm text-white">Connections</span>
            </button>
          </Link>

          <Link to="/requests">
            <button className="flex flex-col items-center text-white-600 hover:text-black">
              <MdFollowTheSigns />
              <span className="text-sm text-white">Requests</span>
            </button>
          </Link>
        </div>
      )}
    </>
  );
};

export default Footer;
