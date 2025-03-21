import io from "socket.io-client";
import { BaseURL } from "../constants/data";

export const createSocketConnection = () => {
  //

  if (location.hostname === "localhost") {
    return io(BaseURL);
  } else {
    return io("/", { path: "/api/socket.io" });
  }
};
