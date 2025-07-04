/* eslint-disable react/prop-types */
// components/PrivateRoute.js
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const user = useSelector((state) => state.user);
  return user ? children : <Navigate to="/" />;
};

export default PrivateRoute;
