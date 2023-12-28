import "./filterPopup.css";
import { AiOutlineClose } from "react-icons/ai";

const FilterItemStatus = ({ closeFilterItemStatus, fetchItemStatus }) => {
  return (
    <div class="filter-exchange">
      <div className="filter-exchange-container">
        <form className="filter-exchange-form">
          <h2 className="filter-exchange-title" style={{ margin: "unset" }}>
            Filter item status
          </h2>
          <button
            className="filter-exchange-btn"
            type="button"
            onClick={() =>
              fetchItemStatus(
                "EXCHANGER_SENT_TO_USER",
                "USER_RECEIVED_SUCCESSFUL"
              )
            }
            style={{ margin: "30px 0 15px 0px" }}
          >
            Item status success
          </button>
          <button
            className="filter-exchange-btn"
            type="button"
            onClick={() =>
              fetchItemStatus("USER_SENT_TO_EXCHANGE_AGAIN", "EXCHANGE")
            }
            style={{ margin: "0px 0 10px 0px" }}
          >
            Item status failed
          </button>
        </form>
      </div>
      <AiOutlineClose
        className="filter-exchange-close"
        onClick={closeFilterItemStatus}
      />
    </div>
  );
};

export default FilterItemStatus;
