import { useContext, useState } from "react";
import "./manageUser.css";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../loading/loading";
import ViewUser from "../viewPopup/ViewUser";
import makeRequest from "../../services/makeRequest";
import { useQuery } from "@tanstack/react-query";

const EmployeeTable = ({ isLoading, error, data }) => {
  const { errorMessage, currentUser } = useContext(AuthContext);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});

  // open visible
  const openVisible = () => setIsVisible(true);
  // close visible
  const closeVisible = () => setIsVisible(false);

  // show ... when strings too long
  const handleStrings = (s) =>
    s != null ? (s.length > 6 ? s.substr(0, 6) + "..." : s) : "";

  return (
    <div class="manage-user-box">
      {/* table header  */}
      <div class="manage-user-head">
        <div class="manage-user-cell first-cell">ID</div>
        <div class="manage-user-cell second-cell">Email</div>
        <div class="manage-user-cell third-cell">Name</div>
        <div class="manage-user-cell fourth-cell">Nick name</div>
        <div class="manage-user-cell fifth-cell">Age</div>
        <div class="manage-user-cell sixth-cell">Address</div>
        <div class="manage-user-cell seventh-cell">Phone</div>
        <div class="manage-user-cell eighth-cell">Role</div>
        <div class="manage-user-cell last-cell"></div>
      </div>

      {/* table rows */}
      {isLoading ? (
        <Loading />
      ) : error ? (
        errorMessage("Something went wrong")
      ) : (
        data?.map((item, index) => (
          <div class="manage-user-row" key={index}>
            <div class="manage-user-cell first-cell">
              <p className="manage-user-cell-text">{handleStrings(item.id)}</p>
            </div>
            <div class="manage-user-cell second-cell">
              <p className="manage-user-cell-text">
                {handleStrings(item.email)}
              </p>
            </div>
            <div class="manage-user-cell third-cell">
              <p className="manage-user-cell-text">
                {handleStrings(item.name)}
              </p>
            </div>
            <div class="manage-user-cell fourth-cell">
              <p className="manage-user-cell-text">
                {handleStrings(item.nickName)}
              </p>
            </div>
            <div class="manage-user-cell fifth-cell">
              <p className="manage-user-cell-text">{handleStrings(item.age)}</p>
            </div>
            <div class="manage-user-cell sixth-cell">
              <p className="manage-user-cell-text">
                {handleStrings(item.address)}
              </p>
            </div>
            <div class="manage-user-cell seventh-cell">
              <p className="manage-user-cell-text">
                {handleStrings(item.phoneNumber)}
              </p>
            </div>
            <div class="manage-user-cell eighth-cell">
              <p className="manage-user-cell-text">
                {handleStrings(item.role)}
              </p>
            </div>
            <div class="manage-user-cell last-cell manage-user-actions">
              <MdOutlineRemoveRedEye
                className="manage-user-actions-icon add"
                onClick={() => {
                  openVisible();
                  setSelectedUser(item);
                }}
              />
              {/* <MdOutlineEdit className="manage-user-actions-icon edit" />
              <MdOutlineDelete className="manage-user-actions-icon delete" /> */}
            </div>
          </div>
        ))
      )}
      {isVisible && (
        <ViewUser user={selectedUser} closeVisible={closeVisible} />
      )}
    </div>
  );
};

export default EmployeeTable;
