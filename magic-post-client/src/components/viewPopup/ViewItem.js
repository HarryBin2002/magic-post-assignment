import "./viewPopup.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../loading/loading";
import { AiOutlineClose } from "react-icons/ai";

const ViewItem = ({ closeVisible, item }) => {
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
            <td className="view-popup-label">Name:</td>
            <td className="view-popup-info">{item.itemName}</td>
          </tr>
          <tr className="view-popup-item">
            <td className="view-popup-label">Type:</td>
            <td className="view-popup-info">{item.itemType}</td>
          </tr>
          <tr className="view-popup-item">
            <td className="view-popup-label">Mass:</td>
            <td className="view-popup-info">{item.itemMass}</td>
          </tr>
          <tr className="view-popup-item">
            <td className="view-popup-label">Description:</td>
            <td className="view-popup-info">{item.itemDescription}</td>
          </tr>
          <tr className="view-popup-item">
            <td className="view-popup-label">Status:</td>
            <td className="view-popup-info">{item.itemStatus}</td>
          </tr>
        </table>
      </div>
      <AiOutlineClose className="view-popup-close" onClick={closeVisible} />
    </div>
  );
};

export default ViewItem;
