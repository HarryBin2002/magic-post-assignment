import "./viewPopup.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../loading/loading";
import { AiOutlineClose } from "react-icons/ai";

const ViewExchange = ({ closeVisible, item }) => {
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
            <td className="view-popup-label">Exchange name:</td>
            <td className="view-popup-info">{item.exchangeName}</td>
          </tr>
          <tr className="view-popup-item">
            <td className="view-popup-label">Exchange address:</td>
            <td className="view-popup-info">{item.exchangeAddress}</td>
          </tr>
          <tr className="view-popup-item">
            <td className="view-popup-label">Exchange leader id:</td>
            <td className="view-popup-info">{item.exchangeLeaderId}</td>
          </tr>
        </table>
      </div>
      <AiOutlineClose className="view-popup-close" onClick={closeVisible} />
    </div>
  );
};

export default ViewExchange;
