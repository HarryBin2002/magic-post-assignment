import "./viewPopup.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../loading/loading";
import { AiOutlineClose } from "react-icons/ai";

const ViewUser = ({ closeVisible, user }) => {
  const { successMessage, errorMessage, setCurrentUser } =
    useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  return (
    <div class="view-popup">
      {loading && <Loading />}
      <div className="view-popup-container">
        <h2 className="view-popup-title">Details information</h2>

        <table className="view-popup-details">
          <tr className="view-popup-item">
            <td className="view-popup-label">ID:</td>
            <td className="view-popup-info">{user.id}</td>
          </tr>
          <tr className="view-popup-item">
            <td className="view-popup-label">Email:</td>
            <td className="view-popup-info">{user.email}</td>
          </tr>
          <tr className="view-popup-item">
            <td className="view-popup-label">Name:</td>
            <td className="view-popup-info">{user.name}</td>
          </tr>
          <tr className="view-popup-item">
            <td className="view-popup-label">Nick name:</td>
            <td className="view-popup-info">{user.nickName}</td>
          </tr>
          <tr className="view-popup-item">
            <td className="view-popup-label">Age:</td>
            <td className="view-popup-info">{user.age}</td>
          </tr>
          <tr className="view-popup-item">
            <td className="view-popup-label">Address:</td>
            <td className="view-popup-info">{user.address}</td>
          </tr>
          <tr className="view-popup-item">
            <td className="view-popup-label">Phone:</td>
            <td className="view-popup-info">{user.phoneNumber}</td>
          </tr>
          <tr className="view-popup-item">
            <td className="view-popup-label">Role:</td>
            <td className="view-popup-info">{user.role}</td>
          </tr>
        </table>
      </div>
      <AiOutlineClose className="view-popup-close" onClick={closeVisible} />
    </div>
  );
};

export default ViewUser;
