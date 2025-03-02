import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
  }
  return (
    user && (
      <div className="flex justify-center mt-2 sm:mt-10 mb-10">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full p-8 transition-all duration-300 animate-fade-in">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 text-center mb-8 md:mb-0">
              <img
                src={user.user.imageURL}
                alt="Profile Picture"
                className="rounded-full w-44 h-44 mx-auto mb-4 border-4 border-indigo-800 dark:border-blue-900 transition-transform duration-300 hover:scale-105"
              />
              <h1 className="text-2xl font-bold text-indigo-800 dark:text-white mb-2">
                {user.user.firstName + " " + user.user.lastName}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">{user?.user?.headline}</p>
              <Link to="/editProfile">
                <button className="mt-4 bg-pink-800 bg-gradient-to-r from-pink-800 to-blue-800 text-white px-4 py-2 rounded-lg transition-colors duration-300">
                  Edit Profile
                </button>
              </Link>
            </div>
            <div className="md:w-2/3 md:pl-8">
              <h2 className="text-xl font-semibold text-indigo-800 dark:text-white mb-4">About Me</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">{user.user.about}</p>
              <h2 className="text-xl font-semibold text-indigo-800 dark:text-white mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {user?.user?.skills?.map((skill, index) => (
                  <span key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
              <h2 className="text-xl font-semibold text-indigo-800 dark:text-white mb-4">
                Contact Information
              </h2>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-indigo-800 dark:text-blue-900"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {user.user.email}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Profile;
