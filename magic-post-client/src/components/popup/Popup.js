import { AiOutlineClose } from "react-icons/ai";
import "./popup.scss";
import Loading from "../loading/loading";
import { handleCloseOptions } from "../../helpers";

const PopupOptions = ({ title, handleAction, loading, setOpenPopup }) => {
  return (
    <div className="pu-options">
      {loading && <Loading />}
      <div className="pu-options-container">
        <h3 className="pu-options-title">{title}</h3>
        <ul className="pu-options-list">
          <li
            className="pu-options-item"
            onClick={() => {
              handleAction();
              handleCloseOptions(setOpenPopup);
            }}
          >
            Confirm
          </li>

          <li
            className="pu-options-item"
            onClick={() => handleCloseOptions(setOpenPopup)}
          >
            Cancel
          </li>
        </ul>
      </div>
      <AiOutlineClose
        className="pu-options-close"
        onClick={() => handleCloseOptions(setOpenPopup)}
      />
    </div>
  );
};

export default PopupOptions;
