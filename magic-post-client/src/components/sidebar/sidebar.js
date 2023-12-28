import { useContext, useState } from "react";
import "./sidebar.scss";
import { Link, useNavigate } from "react-router-dom";
import PopupOptions from "../popup/Popup";
import { handleOpenOptions } from "../../helpers";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = ({ selectedMenu, onChangeMenu }) => {
  const navigate = useNavigate();
  const [openPopup, setOpenPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const { successMessage, currentUser } = useContext(AuthContext);

  const handleLogout = () => {
    setLoading(true);
    localStorage.removeItem("userData");
    setTimeout(() => {
      successMessage("You have been logged out.");
      navigate("/login");
    }, 2000);
    setLoading(true);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-container">
        <Link to="/" className="link">
          <h2 className="sidebar-title">Magic Post</h2>
        </Link>

        <ul className="sidebar-menu">
          {currentUser.role !== "EMPLOYEE_OF_COMMODITY_EXCHANGE" &&
            currentUser.role !== "EMPLOYEE_OF_COMMODITY_GATHERING" &&
            currentUser.role !== "USER_NORMAL" && (
              <li
                onClick={() => onChangeMenu("User")}
                className={
                  selectedMenu === "User"
                    ? "sidebar-item active"
                    : "sidebar-item"
                }
              >
                {currentUser.role === "MANAGER" && "Leader"}
                {(currentUser.role === "LEADER_OF_COMMODITY_GATHERING" ||
                  currentUser.role === "LEADER_OF_COMMODITY_EXCHANGE") &&
                  "Employee"}
              </li>
            )}
          {currentUser.role !== "LEADER_OF_COMMODITY_EXCHANGE" &&
            currentUser.role !== "LEADER_OF_COMMODITY_GATHERING" &&
            currentUser.role !== "EMPLOYEE_OF_COMMODITY_GATHERING" &&
            currentUser.role !== "EMPLOYEE_OF_COMMODITY_EXCHANGE" &&
            currentUser.role !== "USER_NORMAL" && (
              <li
                onClick={() => onChangeMenu("Exchange")}
                className={
                  selectedMenu === "Exchange"
                    ? "sidebar-item active"
                    : "sidebar-item"
                }
              >
                Exchange
              </li>
            )}
          {currentUser.role !== "LEADER_OF_COMMODITY_EXCHANGE" &&
            currentUser.role !== "LEADER_OF_COMMODITY_GATHERING" &&
            currentUser.role !== "EMPLOYEE_OF_COMMODITY_GATHERING" &&
            currentUser.role !== "EMPLOYEE_OF_COMMODITY_EXCHANGE" &&
            currentUser.role !== "USER_NORMAL" && (
              <li
                onClick={() => onChangeMenu("Gathering")}
                className={
                  selectedMenu === "Gathering"
                    ? "sidebar-item active"
                    : "sidebar-item"
                }
              >
                Gathering
              </li>
            )}
          {(currentUser.role === "EMPLOYEE_OF_COMMODITY_EXCHANGE" ||
            currentUser.role === "EMPLOYEE_OF_COMMODITY_GATHERING" ||
            currentUser.role === "MANAGER" ||
            currentUser.role === "LEADER_OF_COMMODITY_EXCHANGE" ||
            currentUser.role === "LEADER_OF_COMMODITY_GATHERING" ||
            currentUser.role === "USER_NORMAL") && (
            <li
              onClick={() => onChangeMenu("Items")}
              className={
                selectedMenu === "Items"
                  ? "sidebar-item active"
                  : "sidebar-item"
              }
            >
              Items
            </li>
          )}
        </ul>
      </div>

      <li
        className="logout-btn"
        onClick={() => handleOpenOptions(setOpenPopup)}
      >
        Log out
      </li>

      {openPopup && (
        <PopupOptions
          title="Are you sure you want to log out ?"
          handleAction={handleLogout}
          loading={loading}
          setOpenPopup={setOpenPopup}
        />
      )}
    </div>
  );
};

export default Sidebar;
