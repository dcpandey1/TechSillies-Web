import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addUser } from "../utils/userSlice";
import { BaseURL } from "../constants/data";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const girlImageURL =
    "https://res.cloudinary.com/dyu786gc9/image/upload/v1740212074/tsdefaultgirl_kr13kj.jpg";
  const boyImageURL = "https://res.cloudinary.com/dyu786gc9/image/upload/v1740212450/image_1_nyfgtb.jpg";
  const imageURL = gender === "Female" ? girlImageURL : boyImageURL;

  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        BaseURL + "/signup",
        { firstName, lastName, email, password, gender, imageURL },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data));
      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="flex justify-center my-10 mx-6 z-20">
        <div className="card w-96 shadow-xl bg-gray-800">
          <div className="card-body">
            <h1 className="card-title justify-center">Sign Up</h1>
            <div>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">First Name</span>
                </div>
                <input
                  value={firstName}
                  type="email"
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
                  type="email"
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>
            </div>
            <div>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Email ID</span>
                </div>
                <input
                  value={email}
                  type="email"
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </div>
            <div>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Password</span>
                </div>
                <input
                  value={password}
                  type="password"
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            </div>
            <div>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Gender</span>
                </div>
                <select
                  onChange={(e) => setGender(e.target.value)}
                  className="select select-bordered w-full max-w-xs"
                >
                  <option disabled selected>
                    Gender
                  </option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </label>
            </div>
            <div className="flex justify-center space-x-2">
              <span>{"Already a User?"}</span>
              <Link to="/login">
                <span className="bg-gradient-to-r from-pink-400 to-blue-300 bg-clip-text text-transparent">
                  {" "}
                  Sign In
                </span>
              </Link>
            </div>

            <div className="card-actions  justify-center">
              <button onClick={() => handleSignUp()} className="btn bg-pink-800 hover:bg-blue-800">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
