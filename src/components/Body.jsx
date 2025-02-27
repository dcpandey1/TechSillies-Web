import { Outlet, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect } from "react";
import { BaseURL } from "../constants/data";
// import bg from "../assests/bg.svg";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);
  const fetchUser = async () => {
    if (userData) {
      return;
    }
    try {
      const res = await axios.get(BaseURL + "/profile/view", {}, { withCredentials: true });
      dispatch(addUser(res.data));
    } catch (error) {
      if (error.status) {
        navigate("/login");
      }
      console.log("Error :" + error);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <>
      <Navbar />
      {/* <div className="min-h-screen bg-cover bg-center opacity-50" style={{ backgroundImage: `url(${bg})` }}> */}
      <Outlet />
      {/* </div> */}
      <Footer />
    </>
  );
};

export default Body;
