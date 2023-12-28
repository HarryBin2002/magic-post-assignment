import { Link } from "react-router-dom";
import "./intro.scss";
import {
  AiOutlineFacebook,
  AiOutlineTwitter,
  AiOutlineInstagram,
  AiOutlineLinkedin,
} from "react-icons/ai";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Intro = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <div className="intro">
      <div className="intro-container">
        <div className="intro-top">
          <div className="intro-top-left">
            <p>Phone: +84 0385999999</p>
            <p>Email: email@gmail.com</p>
          </div>

          <div className="intro-top-right">
            <AiOutlineFacebook className="intro-icon" />
            <AiOutlineTwitter className="intro-icon" />
            <AiOutlineInstagram className="intro-icon" />
            <AiOutlineLinkedin className="intro-icon" />
          </div>
        </div>

        {/* header  */}
        <div className="intro-header">
          <img
            className="intro-header-logo"
            src="https://res.cloudinary.com/djqxdscwh/image/upload/v1699885216/main-logo-white-transparent_o4yzqi.png"
            alt=""
          />
          <div className="intro-header-btn">
            {currentUser.userId && (
              <Link to="/home" className="link">
                <button className="intro-manage">Manage</button>
              </Link>
            )}
            <Link to="/login" className="link">
              <button className="intro-login">Login</button>
            </Link>
            <Link to="/register" className="link">
              <button className="intro-register">Register</button>
            </Link>
          </div>
        </div>

        {/* background  */}
        <div className="intro-desc">
          <h1 className="intro-desc-title">Welcome to Magic Post</h1>
          <p className="intro-desc-detail">
            Efficient and reliable cargo transportation services for all your
            needs. Contact us today for a seamless shipping experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Intro;
