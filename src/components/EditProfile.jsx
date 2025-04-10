import imageCompression from "browser-image-compression";
import axios from "axios";
import { useState } from "react";
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
  const [about, setAbout] = useState(user?.user?.about);
  const [skills, setSkills] = useState(user?.user?.skills || ["C++", "HTML"]); // Default skills
  const [skillInput, setSkillInput] = useState(""); // Input for new skills

  const [toast, setToast] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const addSkill = (e) => {
    e.preventDefault();
    const newSkills = skillInput
      .split(",") // Split by comma
      .map((skill) => skill.trim()) // Remove extra spaces
      .filter((skill) => skill && !skills.includes(skill)); // Remove empty or duplicate skills

    if (newSkills.length > 0) {
      setSkills([...skills, ...newSkills]);
    }
    setSkillInput(""); // Clear input after adding
  };

  // Handle removing a skill
  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Image compression options
      const options = {
        maxSizeMB: 1, // Reduce image size to under 1MB
        maxWidthOrHeight: 500, // Resize to a max width/height
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      setImage(compressedFile);
      setLoading(false);
    } catch (error) {
      console.error("Error compressing image:", error);
      setLoading(false);
    }
  };

  const editProfile = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("about", about);
      formData.append("headline", headline);
      formData.append("skills", skills.join(",")); // Convert array to comma-separated string
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
      console.log("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <div className="flex justify-center my-10 mx-6 z-20">
          <div className="card w-96 shadow-xl bg-slate-800">
            <div className="card-body">
              <h1 className="card-title justify-center">Edit Profile</h1>
              <div>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">First Name</span>
                  </div>
                  <input
                    value={firstName}
                    type="text"
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </label>
              </div>
              <div>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Last Name</span>
                  </div>
                  <input
                    value={lastName}
                    type="text"
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </label>
              </div>
              <div>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Headline</span>
                  </div>
                  <input
                    value={headline}
                    type="text"
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setHeadline(e.target.value)}
                  />
                </label>
              </div>
              <div>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">About</span>
                  </div>
                  <textarea
                    value={about}
                    className="textarea"
                    placeholder="Bio"
                    onChange={(e) => setAbout(e.target.value)}
                  ></textarea>
                </label>
              </div>

              {/* skills input */}
              <div>
                <label className="form-control w-full max-w-xs">
                  <span className="label-text">Skills</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={skillInput}
                      className="input input-bordered w-full"
                      placeholder="Add a skill and press Enter"
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addSkill(e)}
                    />
                    <button className="btn btn-primary" onClick={addSkill} disabled={!skillInput.trim()}>
                      Add
                    </button>
                  </div>
                </label>
              </div>

              {/* Skills List (Tags) */}
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((skill, index) => (
                  <div key={index} className="badge badge-outline px-3 py-2">
                    {skill}
                    <button className="ml-2 text-red-500" onClick={() => removeSkill(skill)}>
                      ✖
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Profile Picture</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="file-input file-input-bordered w-full max-w-xs"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              <p className="text-red-700 flex justify-center">{}</p>
              <div className="card-actions justify-center">
                <button
                  onClick={editProfile}
                  className="btn bg-pink-800 hover:bg-blue-800"
                  disabled={loading}
                >
                  {loading ? <span className="loading loading-spinner text-pink-800"></span> : "Save Profile"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile Saved Successfully</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
