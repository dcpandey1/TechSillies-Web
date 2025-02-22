import axios from "axios";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate, Link } from "react-router-dom";
import { BaseURL } from "../constants/data";

const Login = () => {
  const [email, setEmail] = useState("elon@gmail.com");
  const [password, setPassword] = useState("Elon@87955");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BaseURL + "signin",
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
    <div className="flex justify-center my-10 mx-6 z-20">
      <div className="card w-96 shadow-xl bg-gray-800">
        <div className="card-body">
          <h1 className="card-title justify-center">Login</h1>
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
          <div className="flex justify-center space-x-2">
            <span>{"New Here?"}</span>
            <Link to="/signup">
              <span> Sign Up</span>
            </Link>
          </div>

          <p className="text-red-700 flex justify-center">{errorMessage}</p>
          <div className="card-actions  justify-center">
            <button onClick={() => handleLogin()} className="btn bg-pink-800 hover:bg-blue-800">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
