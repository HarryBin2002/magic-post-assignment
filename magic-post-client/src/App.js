import "./styles/index.scss";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
// import { Suspense, lazy, useContext } from "react";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
// import NotFound from "./NotFound";
import Home from "./pages/home/home";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Intro from "./pages/intro/Intro";
import NotFound from "./pages/notFound/NotFound";

// const Home = lazy(() => import("./pages/Home"));
// const Login = lazy(() => import("./pages/Login"));
// const Register = lazy(() => import("./pages/Register"));
// const Profile = lazy(() => import("./pages/Profile"));
// const PostDetails = lazy(() => import("./pages/PostDetails"));
// const Chat = lazy(() => import("./pages/Chat"));

const PrivateRoute = ({ element }) => {
  // const { currentUser } = useContext(AuthContext);
  // return currentUser.accessToken ? element : <Navigate to="/" />;
  return element;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
