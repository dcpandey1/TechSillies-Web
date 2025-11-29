/* eslint-disable no-unused-vars */
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { BaseURL } from "../constants/data";
import toast from "react-hot-toast";
import { MdEdit, MdEmail, MdLocationOn, MdVerified, MdQrCodeScanner, MdAccountCircle } from "react-icons/md"; // Added icons
import { IoIosCloseCircle } from "react-icons/io";

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

    if (!isFirstRealRender.current) return;
    isFirstRealRender.current = false;

    const { company } = user.user;

    if (!company?.trim()) {
      toast.error("Please update your company or college name.", {
        duration: 4000,
        position: "bottom-right",
      });
    }
  }, [user]);

  // Aadhaar QR scanning
  useEffect(() => {
    let scanner;
    const scannerId = "reader";

    const onScanSuccess = (decodedText) => {
      if (scanner) scanner.clear().catch(() => {});
      setShowScanner(false);
      toast.loading("Verifying Aadhaar QR data...", { id: "aadhaar-scan" });

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
            toast.error(`Verification failed: ${data.error}`, { id: "aadhaar-scan" });
          } else {
            setAadhaarData(data.aadhaarInfo);
            setError(null);
            toast.success("Aadhaar verified successfully!", { id: "aadhaar-scan" });
          }
        })
        .catch(() => {
          setError("Server error during verification.");
          setAadhaarData(null);
          toast.error("Aadhaar verification failed due to a server error.", { id: "aadhaar-scan" });
        });
    };

    const onScanFailure = (error) => {
      // console.warn("QR scan error", error);
    };

    if (showScanner) {
      if (document.getElementById(scannerId)) {
        scanner = new Html5QrcodeScanner(scannerId, { fps: 10, qrbox: { width: 200, height: 200 } }, false); // Smaller QR box
        scanner.render(onScanSuccess, onScanFailure);
      }
    }

    return () => {
      if (scanner) scanner.clear().catch(() => {});
    };
  }, [showScanner]);

  const isVerified = aadhaarData != null;

  return (
    user && (
      <motion.div
        className="flex justify-center py-6 px-4 min-h-screen text-gray-100" // Added dark BG, reduced vertical padding
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="bg-gray-800/25  border border-gray-700 shadow-2xl rounded-2xl shadow-black/50 max-w-xl w-full p-5 md:p-6" // Max width and padding reduced
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* PROFILE HEADER & AVATAR */}
          <header className="flex flex-col sm:flex-row items-center sm:items-start border-b border-gray-700/50 pb-4 mb-5">
            {/* Avatar & Verification Status */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 mb-3 sm:mb-0 mr-0 sm:mr-4">
              {" "}
              {/* Smaller avatar size */}
              <motion.img
                src={user?.user?.imageURL}
                alt="Profile Picture"
                className="rounded-full w-full h-full object-cover border-4 border-primary/70 shadow-lg"
                whileHover={{ scale: 1.05 }}
              />
            </div>
            {/* Basic Info & CTA */}
            <div className="flex-1 text-center sm:text-left pt-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
                {" "}
                {/* Reduced font size */}
                {user.user.firstName} {user?.user?.lastName || ""}
              </h1>

              <p className="text-base font-medium text-secondary mb-3">
                {" "}
                {/* Reduced font size */}
                {user?.user?.headline}
                {user?.user?.company && <span className="text-gray-400"> @ {user?.user?.company}</span>}
              </p>

              {/* Action Buttons (Integrated Aadhaar Button) */}
              <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
                {" "}
                {/* Reduced gap */}
                <Link to="/editProfile">
                  <motion.button
                    className="flex items-center justify-center bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-primary/30 transition-all duration-300" // Reduced padding/font size
                    whileHover={{ scale: 1.05, boxShadow: "0 4px 15px rgba(15, 46, 14, 0.5)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MdEdit className="mr-2 text-lg" /> Edit Profile
                  </motion.button>
                </Link>
                {/* Aadhaar Button Re-integrated */}
              </div>
            </div>
          </header>

          {/* MAIN CONTENT AREA (Clean Flow) */}
          <div className="space-y-4">
            {" "}
            {/* Reduced spacing */}
            {/* Aadhaar Verification & Scanner Section (Moved up) */}
            {/* ABOUT ME (Medium Size) */}
            <div className="p-4 bg-gray-700/50 rounded-xl shadow-lg border border-gray-700">
              {" "}
              {/* Reduced padding */}
              <h2 className="text-xl font-bold text-secondary mb-3 flex items-center">
                <MdAccountCircle className="mr-2 text-xl" /> About Me
              </h2>
              <p className="text-gray-300 leading-relaxed text-sm">
                {" "}
                {/* Reduced font size */}
                {user?.user?.about || "Tell the world a little about yourself by editing your profile!"}
              </p>
            </div>
            {/* SKILLS (Medium Size) */}
            <div className="p-4 bg-gray-700/50 rounded-xl shadow-lg border border-gray-700">
              {" "}
              {/* Reduced padding */}
              <h2 className="text-xl font-bold text-secondary mb-3 flex items-center">
                Skills & Expertise
              </h2>{" "}
              {/* Reduced margin */}
              <div className="flex flex-wrap gap-2">
                {" "}
                {/* Reduced gap */}
                {user?.user?.skills && user.user.skills.length > 0 ? (
                  user.user.skills.map((skill, index) => (
                    <motion.span
                      key={index}
                      className="bg-gray-900 text-secondary border border-primary/50 px-2.5 py-0.5 rounded-full text-xs font-medium shadow-md transition-colors duration-200" // Significantly reduced padding/font size
                      whileHover={{ backgroundColor: "#0f2e0e", color: "white", scale: 1.05 }}
                    >
                      {skill}
                    </motion.span>
                  ))
                ) : (
                  <p className="text-gray-500 text-xs">No skills added yet.</p>
                )}
              </div>
            </div>
            {/* CONTACT (Medium Size) */}
            <div className="p-4 bg-gray-700/50 rounded-xl shadow-lg border border-gray-700">
              {" "}
              {/* Reduced padding */}
              <h2 className="text-xl font-bold text-secondary mb-3 flex items-center">
                <MdEmail className="mr-2 text-xl" /> Contact
              </h2>
              <ul className="space-y-2 text-gray-300 text-sm">
                {" "}
                {/* Reduced spacing and font size */}
                <li className="flex items-center">
                  <MdEmail className="h-4 w-4 mr-3 text-secondary" /> {/* Smaller icon size */}
                  {user?.user?.email}
                </li>
                <li className="flex items-center">
                  <MdLocationOn className="h-4 w-4 mr-3 text-secondary" /> {/* Smaller icon size */}
                  {user?.user?.location || "Location not specified"}
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  );
};

export default Profile;
