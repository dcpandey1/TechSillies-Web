/* eslint-disable no-unused-vars */
import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate, Link } from "react-router-dom";
import { BaseURL } from "../constants/data";
import { motion } from "framer-motion"; // Import motion from framer-motion
import logo from "../assests/latest_logo.svg";
import mainsvg from "../assests/main.svg";
import { MdEmail, MdLock, MdError, MdLogin } from "react-icons/md"; // Added icons

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(BaseURL + "/profile/view", {
          withCredentials: true,
        });
        dispatch(addUser(res.data));
        navigate("/profile");
      } catch (error) {
        // console.error("User fetch error:", error); // Expected if user is not logged in
      }
    };

    fetchUser();
  }, [dispatch, navigate]);

  const handleGoogleLogin = () => {
    const isLocalhost = location.hostname === "localhost";
    const baseURL = isLocalhost ? "http://localhost:3000" : "https://techsillies.com/api";

    // Set loading state before redirect
    setLoading(true);
    window.location.href = `${baseURL}/auth/google`;
  };

  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await axios.post(BaseURL + "/signin", { email, password }, { withCredentials: true });
      dispatch(addUser(res?.data));
      navigate("/");
    } catch (error) {
      setErrorMessage(error?.response?.data || "Something Went Wrong");
      // console.log(error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      // Set overall background to deep dark gray
      className="min-h-screen  text-gray-100 flex justify-center py-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-screen-xl m-0 sm:m-10 bg-gray-800/25 border border-gray-700 shadow-2xl shadow-black/70 sm:rounded-2xl flex justify-center flex-1">
        {/* LEFT COLUMN: LOGIN FORM */}
        <motion.div
          className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col items-center">
            <img src={logo} className="w-32 mb-8" alt="Logo" />
            <h1 className="text-3xl xl:text-4xl font-extrabold text-white">Sign In</h1>
          </div>

          <div className="w-full flex-1 mt-8">
            {/* Google Login */}
            <motion.div
              className="flex flex-col items-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full max-w-xs font-bold shadow-lg rounded-xl py-3 bg-gray-800 text-gray-100 flex items-center justify-center transition-all duration-300 ease-in-out border border-gray-600 hover:bg-gray-600 disabled:opacity-50"
              >
                <div className="bg-white p-2 rounded-full">
                  <svg className="w-4" viewBox="0 0 533.5 544.3">
                    {/* Google SVG paths */}
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

            {/* Separator */}
            <div className="my-10 flex items-center">
              <div className="flex-1 border-b border-gray-700"></div>
              <div className="px-4 text-sm text-gray-400 tracking-wide font-medium">
                Or sign in with E-mail
              </div>
              <div className="flex-1 border-b border-gray-700"></div>
            </div>

            {/* Email/Password Form */}
            <div className="mx-auto max-w-xs">
              {/* Email Input */}
              <div className="relative mb-5">
                <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  value={email}
                  className="w-full px-10 py-3 rounded-lg font-medium bg-slate-900/50 border border-gray-600 placeholder-gray-400 text-sm text-gray-100 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                  type="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  value={password}
                  className="w-full px-10 py-3 rounded-lg font-medium bg-slate-900/50 border border-gray-600 placeholder-gray-400 text-sm text-gray-100 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mt-4 flex items-center justify-center bg-red-900/40 border border-red-500/50 text-red-400 text-sm font-medium px-4 py-3 rounded-xl">
                  <MdError className="w-5 h-5 mr-2 text-red-400" />
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                onClick={handleLogin}
                disabled={loading}
                className="mt-6 tracking-wide font-semibold bg-gradient-to-r from-primary to-secondary text-gray-100 w-full py-3 rounded-xl hover:opacity-90 transition-all duration-300 ease-in-out flex items-center justify-center shadow-lg shadow-primary/30 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                {loading ? (
                  <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <>
                    <MdLogin className="w-6 h-6 -ml-2" />
                    <span className="ml-3">Sign In</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Signup Link */}
          <div className="flex justify-center space-x-2 mt-8">
            <span className="text-gray-400">{"New to Tech Silles?"}</span>
            <Link to="/signup">
              <span className="font-semibold bg-gradient-to-r from-secondary to-secondary bg-clip-text text-transparent hover:text-secondary-light">
                Sign Up
              </span>
            </Link>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: ILLUSTRATION */}
        <div className="flex-1 bg-gradient-to-r from-primary/80 to-secondary/70 text-center hidden lg:flex rounded-r-2xl">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: mainsvg ? `url(${mainsvg})` : "none",
            }}
          ></div>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
