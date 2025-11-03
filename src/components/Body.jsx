import { Outlet, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect, useRef, useState } from "react";
import { BaseURL } from "../constants/data";
import * as THREE from "three";
import RINGS from "vanta/dist/vanta.rings.min";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);

  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  const fetchUser = async () => {
    if (userData) {
      return;
    }
    try {
      const res = await axios.get(BaseURL + "/profile/view", { withCredentials: true });
      dispatch(addUser(res.data));
    } catch (error) {
      if (error?.response?.status) {
        navigate("/home");
      }
      console.log("Error :" + error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        RINGS({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: true,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          backgroundColor: 0x162028,
          color: 0xaf0561,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Vanta Background */}
      <div ref={vantaRef} className="fixed top-0 left-0 w-full h-full -z-20" />

      {/* Overlay image with blend mode */}
      <div className="fixed top-0 left-0 w-full h-full bg-cover  bg-gradient-to-r from-black  to-gray-800 opacity-70 bg-center " />

      {/* Main content */}
      <div className="relative z-10">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </div>
  );
};

export default Body;
