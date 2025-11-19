import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { BaseURL } from "../constants/data";
import toast from "react-hot-toast";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [showScanner, setShowScanner] = useState(false);
  const [aadhaarData, setAadhaarData] = useState(null);
  const [error, setError] = useState(null);

  // ⭐ Strict Mode safe toast control
  const isFirstRealRender = useRef(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // ⭐ Show toast only once after real render (Strict Mode safe)
  useEffect(() => {
    if (!user || !user.user) return;

    // Prevent double firing in Strict Mode
    if (!isFirstRealRender.current) return;
    isFirstRealRender.current = false;

    const { company, college } = user.user;

    if (!company?.trim() || !college?.trim()) {
      toast.error("Please update your company or college name.", {
        duration: 4000,
        position: "bottom-right",
      });
    }
  }, [user]);

  // Aadhaar QR scanning
  useEffect(() => {
    let scanner;

    if (showScanner) {
      scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);

      scanner.render(
        (decodedText) => {
          scanner.clear().catch(() => {});
          setShowScanner(false);

          fetch(BaseURL + "/profile/verify-aadhaar-qr", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
        (error) => console.warn("QR scan error", error)
      );
    }

    return () => {
      if (scanner) scanner.clear().catch(() => {});
    };
  }, [showScanner]);

  return (
    user && (
      <motion.div
        className="flex justify-center mt-2 sm:mt-24 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="bg-slate-800/25 border border-gray-700 shadow-2xl rounded-2xl shadow-gray-950 max-w-2xl w-full p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex flex-col md:flex-row">
            {/* LEFT SIDE PROFILE CARD */}
            <motion.div
              className="md:w-1/3 text-center mb-8 md:mb-0"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.img
                src={user?.user?.imageURL}
                alt="Profile Picture"
                className="rounded-full w-44 h-44 mx-auto mb-4 border-2 border-gray-500 hover:scale-105 transition-transform"
              />

              <h1 className="text-2xl font-bold text-white mb-2">
                {user.user.firstName} {user?.user?.lastName || ""}
              </h1>

              <p className="text-gray-300">
                {user?.user?.headline} @ {user?.user?.company}
              </p>

              <Link to="/editProfile">
                <motion.button
                  className="mt-4 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  Edit Profile
                </motion.button>
              </Link>

              {/* QR Scanner Box */}
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

              {error && <p className="text-red-500 mt-4">{error}</p>}

              {aadhaarData && (
                <div className="mt-6 p-4 bg-gray-800 text-white rounded text-left">
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

            {/* RIGHT SIDE INFO */}
            <motion.div
              className="md:w-2/3 md:pl-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {/* ABOUT */}
              <h2 className="text-xl font-semibold mb-2">About Me</h2>
              <p className="text-gray-300 mb-6">{user?.user?.about}</p>

              {/* SKILLS */}
              <h2 className="text-xl font-semibold mb-2">Skills</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {user?.user?.skills?.map((skill, index) => (
                  <span key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>

              {/* CONTACT */}
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-blue-900" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {user?.user?.email}
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    )
  );
};

export default Profile;
