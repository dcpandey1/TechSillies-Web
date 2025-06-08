import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { BaseURL } from "../constants/data";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [showScanner, setShowScanner] = useState(false);
  const [aadhaarData, setAadhaarData] = useState(null);
  const [error, setError] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    let scanner;

    if (showScanner) {
      scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);

      scanner.render(
        (decodedText) => {
          // Stop scanning after getting result
          scanner.clear().catch(() => {});
          setShowScanner(false);

          // Send QR data to backend
          fetch(BaseURL + "/profile/verify-aadhaar-qr", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ qrData: decodedText }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.error) {
                setError(data.error);
                setAadhaarData(null);
              } else {
                setAadhaarData(data.aadhaarInfo);
                setError(null);
              }
            })
            .catch(() => {
              setError("Server error");
              setAadhaarData(null);
            });
        },
        (error) => {
          // Optional: scan error feedback
          console.warn("QR scan error", error);
        }
      );
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(() => {});
      }
    };
  }, [showScanner]);

  return (
    user && (
      <motion.div
        className="flex justify-center mt-2 sm:mt-24 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="bg-slate-800/20 backdrop-blur-sm rounded-xl shadow-xl shadow-gray-950 max-w-3xl w-full p-8 transition-all duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row">
            <motion.div
              className="md:w-1/3 text-center mb-8 md:mb-0"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.img
                src={user?.user?.imageURL}
                alt="Profile Picture"
                className="rounded-full w-44 h-44 mx-auto mb-4 border-2 border-gray-500 transition-transform duration-300 hover:scale-105"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />
              <h1 className="text-2xl font-bold text-white mb-2">
                {user.user.firstName + " " + (user?.user?.lastName ? user?.user?.lastName : "")}
              </h1>
              <p className="text-gray-300">{user?.user?.headline}</p>

              <Link to="/editProfile">
                <motion.button
                  className="mt-4 bg-pink-800 bg-gradient-to-r from-pink-800 to-blue-800 text-white px-4 py-2 rounded-lg transition-colors duration-300 mr-2"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  Edit Profile
                </motion.button>
              </Link>

              {/* Aadhaar Verify Button */}
              <button
                onClick={() => {
                  setAadhaarData(null);
                  setError(null);
                  setShowScanner(true);
                }}
                className="mt-4 bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-green-600"
              >
                Verify Aadhaar QR
              </button>

              {/* QR Scanner mount point */}
              {showScanner && (
                <div
                  id="reader"
                  style={{
                    width: "320px",
                    height: "320px",
                    margin: "20px auto 0",
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                ></div>
              )}

              {/* Display error if any */}
              {error && <p className="text-red-500 mt-4 max-w-xs mx-auto">{error}</p>}

              {/* Display Aadhaar info if verified */}
              {aadhaarData && (
                <div className="mt-6 p-4 bg-gray-800 text-white rounded max-w-xs mx-auto text-left">
                  <h3 className="text-lg font-bold mb-2">Aadhaar Verified Info:</h3>
                  <p>
                    <strong>Name:</strong> {aadhaarData.name}
                  </p>
                  <p>
                    <strong>DOB:</strong> {aadhaarData.dob}
                  </p>
                  <p>
                    <strong>Gender:</strong> {aadhaarData.gender}
                  </p>
                  <p>
                    <strong>Phone:</strong> {aadhaarData.phone || "N/A"}
                  </p>
                  <p>
                    <strong>Email:</strong> {aadhaarData.email || "N/A"}
                  </p>
                  <p>
                    <strong>Address:</strong> {aadhaarData.address}
                  </p>
                </div>
              )}
            </motion.div>

            <motion.div
              className="md:w-2/3 md:pl-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <motion.h2
                className="text-xl font-semibold mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                About Me
              </motion.h2>
              <motion.p
                className="text-gray-300 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                {user?.user?.about}
              </motion.p>
              <motion.h2
                className="text-xl font-semibold mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.5 }}
              >
                Skills
              </motion.h2>
              <motion.div
                className="flex flex-wrap gap-2 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.5 }}
              >
                {user?.user?.skills?.map((skill, index) => (
                  <span key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </motion.div>
              <motion.h2
                className="text-xl font-semibold mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
              >
                Contact Information
              </motion.h2>
              <motion.ul
                className="space-y-2 text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.7, duration: 0.5 }}
              >
                <motion.li
                  className="flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.9, duration: 0.5 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-blue-900"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {user?.user?.email}
                </motion.li>
              </motion.ul>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    )
  );
};

export default Profile;
