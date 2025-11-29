/* eslint-disable react/prop-types */
import imageCompression from "browser-image-compression";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BaseURL } from "../constants/data";
import { motion } from "framer-motion";
import { MdAdd, MdClose, MdCameraAlt, MdSave } from "react-icons/md";
import toast from "react-hot-toast";

// FIX: Move InputField OUTSIDE of the main component
const InputField = ({ label, value, onChange, placeholder, type = "text", required = false }) => (
  <div className="w-full mb-3">
    <label className="mb-1 text-gray-300 block font-semibold text-sm">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {type === "textarea" ? (
      <textarea
        value={value}
        onChange={onChange}
        className="mt-1 p-2.5 w-full border border-gray-700 rounded-lg text-gray-100 bg-gray-800/70 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all resize-none text-sm"
        placeholder={placeholder}
        rows={3}
        required={required}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="mt-1 p-2.5 w-full border border-gray-700 rounded-lg text-gray-100 bg-gray-800/70 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all text-sm"
        placeholder={placeholder}
        required={required}
      />
    )}
  </div>
);

const EditProfile = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Initialize states with user data
  const [firstName, setFirstName] = useState(user?.user?.firstName || "");
  const [lastName, setLastName] = useState(user?.user?.lastName || "");
  const [headline, setHeadline] = useState(user?.user?.headline || "");
  const [company, setCompany] = useState(user?.user?.company || "");
  const [about, setAbout] = useState(user?.user?.about || "");
  const [skills, setSkills] = useState(user?.user?.skills || []);

  const [skillInput, setSkillInput] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.user?.imageURL || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Clean up blob URL on unmount/re-render
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // --- SKILL MANAGEMENT ---
  const addSkill = useCallback(
    (e) => {
      e.preventDefault();
      const newSkills = skillInput
        .split(/[,;]/)
        .map((skill) => skill.trim())
        .filter((skill) => skill && skill.length < 30 && !skills.includes(skill));

      if (newSkills.length > 0) {
        if (skills.length + newSkills.length > 25) {
          setError("Maximum 25 skills allowed.");
          return;
        }
        setSkills((prevSkills) => [...prevSkills, ...newSkills]);
      }
      setSkillInput("");
      setError("");
    },
    [skillInput, skills]
  );

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  // --- IMAGE UPLOAD ---
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("Please upload images below 10 MB.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      setImage(compressedFile);

      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
      const previewUrl = URL.createObjectURL(compressedFile);
      setImagePreview(previewUrl);
    } catch (error) {
      console.error("Error compressing image:", error);
      setError("Failed to compress the image. Try using a smaller file.");
    } finally {
      setLoading(false);
    }
  };

  // --- PROFILE SUBMISSION ---
  const editProfile = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!firstName || !headline || !company) {
      setError("First Name, Headline, and Company/College are required.");
      return;
    }

    const toastId = toast.loading("Saving profile changes...");

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("about", about);
      formData.append("company", company);
      formData.append("headline", headline);
      formData.append("skills", skills.join(","));
      if (image) formData.append("image", image);

      const res = await axios.patch(BaseURL + "/profile/edit", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch(addUser(res?.data));

      toast.success("Profile Saved Successfully!", { id: toastId });
      setTimeout(() => navigate("/profile"), 1000);
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data ||
        "Failed to save profile. Please check your network.";

      setError(errorMessage);
      toast.error(errorMessage, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-6 px-4 min-h-screen">
      <motion.div
        className="lg:w-[60%] md:w-[75%] w-full mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full mx-auto bg-gray-800/25 border border-gray-700 shadow-2xl rounded-2xl shadow-black/50 p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-5 border-b border-gray-700 pb-3">
            Edit Your Profile
          </h2>
          <form onSubmit={editProfile}>
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-28 h-28 rounded-full border-4 border-primary/70 shadow-xl relative overflow-hidden flex items-center justify-center bg-gray-700">
                <img
                  src={imagePreview || "https://via.placeholder.com/150"}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
                <input
                  type="file"
                  name="profile"
                  id="upload_profile"
                  accept="image/*"
                  hidden
                  onChange={handleImageUpload}
                  disabled={loading}
                />
                <label
                  htmlFor="upload_profile"
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                >
                  <MdCameraAlt className="text-white text-3xl" />
                </label>
              </div>
              <p className="mt-2 text-gray-400 text-xs">Click photo to change</p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center p-2 mb-4 rounded-lg bg-red-900/40 text-red-400 border border-red-500/50 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* General Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <InputField
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                required={true}
              />
              <InputField
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
              />
              <InputField
                label="Headline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Software Engineer | Tech Enthusiast"
                required={true}
              />
              <InputField
                label="Company/College"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Google, XYZ University, etc."
                required={true}
              />
            </div>

            {/* About */}
            <InputField
              label="About You"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="A brief summary of your professional experience and goals."
              type="textarea"
            />

            {/* Skills Input */}
            <div className="w-full mb-4 border p-3 rounded-lg border-gray-700 bg-gray-800/50">
              <label className="mb-1 text-gray-300 block font-semibold text-sm">Skills (Max 25)</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSkill(e)}
                  className="p-2.5 w-full border border-gray-700 rounded-lg text-gray-100 bg-gray-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
                  placeholder="Enter skill (e.g., React, Python) or comma-separated list"
                />
                <motion.button
                  type="button"
                  className="flex items-center justify-center bg-secondary hover:bg-secondary/80 text-white p-2.5 rounded-lg flex-shrink-0 shadow-md transition-colors duration-200"
                  onClick={addSkill}
                  disabled={!skillInput.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MdAdd className="text-xl" />
                </motion.button>
              </div>
            </div>

            {/* Skills List */}
            <div className="flex flex-wrap gap-2 mt-4 min-h-[30px]">
              {skills.length === 0 && <p className="text-gray-500 text-sm">No skills added yet.</p>}
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  className="flex items-center bg-primary/70 text-white px-2.5 py-1 rounded-full text-xs font-medium border border-primary transition-colors duration-200"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  {skill}
                  <button
                    type="button"
                    className="ml-2 text-white/80 hover:text-white transition-colors"
                    onClick={() => removeSkill(skill)}
                  >
                    <MdClose className="text-base" />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="w-full mt-8">
              <motion.button
                type="submit"
                className="w-full sm:w-2/3 lg:w-1/3 mx-auto flex items-center justify-center p-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-lg font-semibold shadow-xl shadow-primary/30 transition-all duration-300"
                disabled={loading}
                whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(15, 46, 14, 0.6)" }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">Saving...</span>
                ) : (
                  <span className="flex items-center gap-2">
                    <MdSave className="text-2xl" /> Save Profile
                  </span>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </section>
  );
};

export default EditProfile;
