import imageCompression from "browser-image-compression";
import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BaseURL } from "../constants/data";

const EditProfile = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(user?.user?.firstName);
  const [lastName, setLastName] = useState(user?.user?.lastName);
  const [headline, setHeadline] = useState(user?.user?.headline);
  const [company, setCompany] = useState(user?.user?.company);
  const [about, setAbout] = useState(user?.user?.about || "");
  const [skills, setSkills] = useState(user?.user?.skills || ["C++", "HTML"]);
  const [skillInput, setSkillInput] = useState("");
  const [toast, setToast] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Added error state

  useEffect(() => {
    if (user?.user?.imageURL) {
      setImagePreview(user.user.imageURL);
    }
  }, [user]);

  const addSkill = (e) => {
    e.preventDefault();
    const newSkills = skillInput
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill && !skills.includes(skill));

    if (newSkills.length > 0) {
      setSkills([...skills, ...newSkills]);
    }
    setSkillInput("");
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(""); // Clear previous errors
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 500,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      setImage(compressedFile);
      const previewUrl = URL.createObjectURL(compressedFile);
      setImagePreview(previewUrl);
    } catch (error) {
      console.error("Error compressing image:", error);
      setError("Failed to compress image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const editProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(""); // Clear previous errors
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
      setToast(true);
      setTimeout(() => {
        setToast(false);
        navigate("/profile");
      }, 1000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(
        error.response?.data || // Backend-specific error
          "Failed to save profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <section className="py-10 my-auto">
      <div className="lg:w-[70%] md:w-[90%] w-[96%] mx-auto flex gap-4">
        <div className="w-full sm:w-[88%] mx-auto bg-slate-800/20 backdrop-blur-sm border border-slate-800 shadow-xl shadow-gray-950 p-6 rounded-xl">
          <div>
            <form onSubmit={editProfile}>
              {/* Profile Image */}
              <div className="mx-auto flex justify-center w-[141px] h-[141px] bg-blue-300/20 rounded-full bg-cover bg-center bg-no-repeat">
                <div
                  className="w-full h-full rounded-full border-2 border-gray-500"
                  style={{
                    backgroundImage: `url(${imagePreview || "https://via.placeholder.com/150"})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="bg-white/90 rounded-full w-6 h-6 text-center ml-28 mt-4">
                    <input
                      type="file"
                      name="profile"
                      id="upload_profile"
                      accept="image/*"
                      hidden
                      onChange={handleImageUpload}
                    />
                    <label htmlFor="upload_profile" className="cursor-pointer">
                      <svg
                        className="w-6 h-5 text-blue-700"
                        fill="none"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                        />
                      </svg>
                    </label>
                  </div>
                </div>
              </div>
              <h2 className="text-center mt-1 font-semibold text-gray-300">Upload Profile Image</h2>

              {/* Error Message */}
              {error && <div className="text-center mt-2 text-pink-700">{error}</div>}

              {/* First Name and Last Name */}
              <div className="flex flex-col lg:flex-row gap-2 justify-center w-full">
                <div className="w-full mb-4 mt-6">
                  <label className="mb-2 text-gray-300">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-2 p-4 w-full border-2 rounded-lg text-gray-200 border-gray-600 bg-gray-800"
                    placeholder="First Name"
                  />
                </div>
                <div className="w-full mb-4 lg:mt-6">
                  <label className="mb-2 text-gray-300">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-2 p-4 w-full border-2 rounded-lg text-gray-200 border-gray-600 bg-gray-800"
                    placeholder="Last Name"
                  />
                </div>
              </div>

              {/* Headline and About */}
              <div className="flex flex-col lg:flex-row gap-2 justify-center w-full">
                <div className="w-full mb-4">
                  <label className="mb-2 text-gray-300">Headline</label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="mt-2 p-4 w-full border-2 rounded-lg text-gray-200 border-gray-600 bg-gray-800"
                    placeholder="Headline"
                  />
                </div>
                <div className="w-full mb-4">
                  <label className="mb-2 text-gray-300">Company</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="mt-2 p-4 w-full border-2 rounded-lg text-gray-200 border-gray-600 bg-gray-800"
                    placeholder="Company"
                  />
                </div>
                <div className="w-full mb-4">
                  <label className="mb-2 text-gray-300">About</label>
                  <textarea
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className="mt-2 p-4 w-full border-2 rounded-lg text-gray-200 border-gray-600 bg-gray-800"
                    placeholder="About"
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="w-full mb-4">
                <label className="mb-2 text-gray-300">Skills</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSkill(e)}
                    className="mt-2 p-4 w-full border-2 rounded-lg text-gray-200 border-gray-600 bg-gray-800"
                    placeholder="Add a skill and press Enter"
                  />
                  <button
                    className="btn bg-pink-800 hover:bg-blue-800 text-white mt-2"
                    onClick={addSkill}
                    disabled={!skillInput.trim()}
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Skills List */}
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((skill, index) => (
                  <div key={index} className="badge badge-outline px-3 py-2 text-gray-200">
                    {skill}
                    <button className="ml-2 text-red-500" onClick={() => removeSkill(skill)}>
                      ✖
                    </button>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="w-1/2 sm:w-1/3 mx-auto rounded-lg bg-gradient-to-r from-primary to-secondary mt-4 text-white text-lg font-semibold">
                <button type="submit" className="p-4 flex justify-center mx-auto" disabled={loading}>
                  {loading ? <span className="loading loading-spinner  text-white"></span> : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {toast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success bg-primary text-white">
            <span>Profile Saved Successfully</span>
          </div>
        </div>
      )}
    </section>
  );
};

export default EditProfile;
