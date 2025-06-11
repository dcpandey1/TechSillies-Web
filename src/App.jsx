import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Feed from "./components/Feed";
import Connections from "./components/Connections";
import EditProfile from "./components/EditProfile";
import Requests from "./components/Requests";
import SignUp from "./components/SignUp";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Chat from "./components/Chat";
import Blogs from "./components/Blogs";
import Article from "./components/Article";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Body />}>
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/" element={<Feed />} />
            <Route path="/policy" element={<PrivacyPolicy />} />
            <Route path="/chat/:targetUserId" element={<Chat />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/blogs/:id" element={<Article />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/editProfile" element={<EditProfile />} />
            <Route path="/requests" element={<Requests />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
