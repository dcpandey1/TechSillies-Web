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
  const [about, setAbout] = useState(user?.user?.about);
  const [toast, setToast] = useState(false);
  const [image, setImage] = useState(null);

  const editProfile = async () => {
    try {
      const res = await axios.patch(
        BaseURL + "/profile/edit",
        { firstName, lastName, about, image },
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Res Edit ", res);
      dispatch(addUser(res?.data));
      setToast(true);
      setTimeout(() => {
        setToast(false);
        navigate("/profile");
      }, 1000);
    } catch (error) {
      console.log("Error" + error.message);
    }
  };
  return (
    <>
      <div>
        <div className="flex justify-center my-10 mx-6 z-20">
          <div className="card w-96 shadow-xl bg-gray-800">
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

              <div>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Profile Picture</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="file-input file-input-bordered w-full max-w-xs"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </label>
              </div>
              {/* <div>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Skills</span>
                  </div>
                  <input
                    value={skill}
                    type="text"
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setSkill(e.target.value)}
                  />
                </label>
              </div> */}

              <p className="text-red-700 flex justify-center">{}</p>
              <div className="card-actions  justify-center">
                <button onClick={() => editProfile()} className="btn bg-pink-800 hover:bg-blue-800">
                  Save Profile
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
