import "./viewPopup.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../loading/loading";
import { AiOutlineClose } from "react-icons/ai";

const ViewGathering = ({ closeVisible, item }) => {
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
            <td className="view-popup-info">{item.id}</td>
          </tr>
          <tr className="view-popup-item">
            <td className="view-popup-label">Gathering name:</td>
            <td className="view-popup-info">{item.gatheringName}</td>
          </tr>
          <tr className="view-popup-item">
            <td className="view-popup-label">Gathering address:</td>
            <td className="view-popup-info">{item.gatheringAddress}</td>
          </tr>
          <tr className="view-popup-item">
            <td className="view-popup-label">Gathering leader id:</td>
            <td className="view-popup-info">{item.gatheringLeaderId}</td>
          </tr>
        </table>
      </div>
      <AiOutlineClose className="view-popup-close" onClick={closeVisible} />
    </div>
  );
};

export default ViewGathering;
