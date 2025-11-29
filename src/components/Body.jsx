import { Outlet, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect, useRef, useState } from "react";
import { BaseURL } from "../constants/data";
import * as THREE from "three";
import RINGS from "vanta/dist/vanta.rings.min";
import { initFCM, subscribeToForegroundMessages } from "../utils/fcmClient";
import { toast } from "react-hot-toast";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  // Fetch logged-in user
  const fetchUser = async () => {
    try {
      const res = await axios.get(BaseURL + "/profile/view", { withCredentials: true });
      dispatch(addUser(res.data));

      // Initialize FCM after user is available
      initFCM(res.data);
    } catch (error) {
      if (error?.response?.status === 401) {
        navigate("/home");
      }
      console.log("Error :" + error);
    }
  };

  // Register FCM listener + load user
  useEffect(() => {
    console.log("Registering FCM foreground listener…");

    // Register once
    subscribeToForegroundMessages((payload) => {
      console.log("🔥 Foreground FCM received:", payload);

      // 1. Extract the specific strings you want to show
      const title = payload.data?.title || "New Notification";
      const body = payload.data?.body || "You have a new message.";

      // 2. Pass ONLY the string to the UI
      toast(`${title}: ${body}`);
      // alert(`${title}\n${body}`); // fallback
    });

    fetchUser();
  }, []); // register only once

  // Vanta Background
  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        RINGS({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: true,
          minHeight: 200,
          minWidth: 200,
          scale: 1,
          scaleMobile: 1,
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
      <div ref={vantaRef} className="fixed top-0 left-0 w-full h-full -z-20" />
      <div className="fixed top-0 left-0 w-full h-full bg-cover bg-gradient-to-r from-black to-gray-800 opacity-70 bg-center" />
      <div className="relative z-10">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </div>
  );
};

export default Body;
