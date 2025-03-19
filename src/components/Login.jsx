import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate, Link } from "react-router-dom";
import { BaseURL } from "../constants/data";
import { motion } from "framer-motion"; // Import motion from framer-motion

const Login = () => {
  const [email, setEmail] = useState("elon@gmail.com");
  const [password, setPassword] = useState("Elon@87955");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(BaseURL + "/profile/view", {
          withCredentials: true, // Ensures cookies are sent
        });
        dispatch(addUser(res.data)); // Store user in Redux
        navigate("/profile"); // Redirect after successful login
      } catch (error) {
        console.error("User fetch error:", error);
      }
    };

    fetchUser();
  }, [dispatch, navigate]);

  const handleGoogleLogin = () => {
    window.location.href = BaseURL + "/auth/google";
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BaseURL + "/signin",
        { email, password },
        { withCredentials: true } // used to save token in cookies
      );
      dispatch(addUser(res?.data)); // adding data to redux store
      navigate("/");
    } catch (error) {
      setErrorMessage(error?.response?.data || "Something Went Wrong");
      console.log(error?.response?.data);
    }
  };

  return (
    <motion.div
      className="min-h-screen text-gray-900 flex justify-center m-2"
      initial={{ opacity: 0 }} // Initial state: completely transparent
      animate={{ opacity: 1 }} // Animate to fully visible
      transition={{ duration: 0.5 }} // Animation duration
    >
      <div className="max-w-screen-xl m-0 sm:m-10 bg-gray-800 shadow sm:rounded-lg flex justify-center flex-1">
        <motion.div
          className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12"
          initial={{ x: -200 }} // Start from the left
          animate={{ x: 0 }} // Animate to the normal position
          transition={{ duration: 0.8 }} // Animation duration
        >
          <div>
            <img src="https://techsillies.com/assets/ts_logo-B2xY8GeG.svg" className="w-32 mx-auto" />
          </div>
          <div className="mt-6 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold text-gray-400">Sign In</h1>
            <div className="w-full flex-1 mt-8">
              <motion.div
                className="flex flex-col items-center"
                initial={{ scale: 0 }} // Initial state: scaled down
                animate={{ scale: 1 }} // Animate to normal scale
                transition={{ duration: 0.5 }} // Animation duration
              >
                <button
                  onClick={handleGoogleLogin}
                  className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline"
                >
                  <div className="bg-white p-2 rounded-full">
                    <svg className="w-4" viewBox="0 0 533.5 544.3">
                      <path
                        d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                        fill="#4285f4"
                      />
                      <path
                        d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                        fill="#34a853"
                      />
                      <path
                        d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                        fill="#fbbc04"
                      />
                      <path
                        d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                        fill="#ea4335"
                      />
                    </svg>
                  </div>
                  <span className="ml-4">Sign In with Google</span>
                </button>
              </motion.div>

              <div className="my-12 flex items-center">
                <div className="flex-1 border-b border-gray-400"></div>
                <div className="px-4 text-sm text-gray-400 tracking-wide font-medium">
                  Or sign in with E-mail
                </div>
                <div className="flex-1 border-b border-gray-400"></div>
              </div>

              <div className="mx-auto max-w-xs">
                <input
                  value={email}
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  value={password}
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errorMessage && (
                  <div className="mt-2 flex items-center justify-center bg-red-100 border border-red-400 text-red-800 text-sm font-medium px-4 py-2 rounded-md">
                    <svg className="w-5 h-5 mr-2 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-8-3a1 1 0 00-1 1v3a1 1 0 002 0V8a1 1 0 00-1-1zm0 6a1 1 0 100 2 1 1 0 000-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errorMessage}
                  </div>
                )}
                <motion.button
                  onClick={() => handleLogin()}
                  className="mt-5 tracking-wide font-semibold bg-blue-900 text-gray-100 w-full py-4 rounded-lg hover:bg-pink-800 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  whileHover={{ scale: 1.05 }} // Add hover scale effect
                  transition={{ duration: 0.2 }} // Duration for hover effect
                >
                  <svg
                    className="w-6 h-6 -ml-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <path d="M20 8v6M23 11h-6" />
                  </svg>
                  <span className="ml-3">Sign In</span>
                </motion.button>
              </div>
            </div>
          </div>
          <div className="flex justify-center space-x-2 m-2">
            <span className="text-gray-300">{"New to Tech Silles ?"}</span>
            <Link to="/signup">
              <span className="bg-gradient-to-r from-pink-400 to-blue-300 bg-clip-text text-transparent">
                {" "}
                Sign Up
              </span>
            </Link>
          </div>
        </motion.div>
        <div className="flex-1 bg-gradient-to-r from-pink-800 to-blue-800 text-center hidden lg:flex rounded-r-lg">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')",
            }}
          ></div>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
