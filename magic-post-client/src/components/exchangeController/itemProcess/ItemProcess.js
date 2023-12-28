import React, { useContext, useEffect, useState } from "react";
import makeRequest from "../../../services/makeRequest";
import { AuthContext } from "../../../context/AuthContext";
import { AiOutlineClose } from "react-icons/ai";
import Loading from "../../loading/loading";
import "./itemProcess.scss";
import moment from "moment";
import { MdDone } from "react-icons/md";

const ItemProcess = ({ closeFormModal, listItemProcess }) => {
  const { currentUser } = useContext(AuthContext);
  const [loading] = useState(false);
  const formatTime = (timestamp) =>
    moment.unix(timestamp).format("DD-MM-YYYY hh:mm A");

  const [locations, setLocations] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchLocation = async (locationId, locationType) => {
      try {
        const res = await makeRequest.get(
          `/customer/get-info-object?objectId=${locationId}&objectType=${locationType}`,
          {
            headers: { Authorization: `Bearer ${currentUser.accessToken}` },
          }
        );
        return res.data.data;
      } catch (error) {
        console.error("Error fetching location:", error);
        throw error;
      }
    };

    const fetchEmployee = async (employeeId) => {
      try {
        const res = await makeRequest.get(
          `/customer/get-info-object?objectId=${employeeId}&objectType=EMPLOYEE`,
          {
            headers: { Authorization: `Bearer ${currentUser.accessToken}` },
          }
        );
        return res.data.data;
      } catch (error) {
        console.error("Error fetching employee:", error);
        throw error;
      }
    };

    const fetchData = async () => {
      const locationPromises = listItemProcess
        .filter((item) => item.locationId)
        .map((item) => fetchLocation(item.locationId, item.locationType));

      const employeePromises = listItemProcess
        .filter((item) => item.employeeId)
        .map((item) => fetchEmployee(item.employeeId));

      try {
        const locationData = await Promise.all(locationPromises);
        const employeeData = await Promise.all(employeePromises);

        setLocations(locationData);
        setEmployees(employeeData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [listItemProcess, currentUser.accessToken]);

  const getLocationItem = (locationId) => {
    const location = locations.find((loc) => loc?.id === locationId);
    return location;
  };

  const getEmployee = (employeeId) => {
    const employee = employees.find((emp) => emp?.userId === employeeId);
    return employee;
  };

  return (
    <div class="item-process">
      {loading && <Loading />}
      <div className="item-process-container">
        {listItemProcess
          ?.slice()
          .reverse()
          .map((item, index) => (
            <div className="item-process-child" key={index}>
              <p className="item-process-time">{formatTime(item.commitTime)}</p>
              <div className="item-process-status-progress">
                <div
                  className={
                    index === 0
                      ? "item-process-status active"
                      : "item-process-status"
                  }
                >
                  <MdDone
                    className={
                      index === 0
                        ? "item-process-icon active"
                        : "item-process-icon"
                    }
                  />
                </div>
              </div>

              <div className="item-process-details">
                <p className="item-process-description">{item.description}</p>
                <p className="item-process-details-desc">
                  {(
                    getLocationItem(item.locationId)?.exchangeName ||
                    getLocationItem(item.locationId)?.gatheringName
                  )?.length > 0 &&
                    `${
                      item?.locationType
                        ?.toLowerCase()
                        .charAt(0)
                        .toUpperCase() +
                      item?.locationType?.toLowerCase()?.slice(1)
                    } name:    ${
                      getLocationItem(item.locationId)?.exchangeName ||
                      getLocationItem(item.locationId)?.gatheringName
                    }`}
                </p>
                <p className="item-process-details-desc">
                  {(
                    getLocationItem(item.locationId)?.exchangeAddress ||
                    getLocationItem(item.locationId)?.gatheringAddress
                  )?.length > 0 &&
                    `${
                      item?.locationType
                        ?.toLowerCase()
                        .charAt(0)
                        .toUpperCase() +
                      item?.locationType?.toLowerCase()?.slice(1)
                    } address:    ${
                      getLocationItem(item.locationId)?.exchangeAddress ||
                      getLocationItem(item.locationId)?.gatheringAddress
                    }`}
                </p>
                <p className="item-process-details-desc">
                  {getEmployee(item.employeeId)?.name?.length > 0 &&
                    `Employee name:    ${getEmployee(item.employeeId)?.name}`}
                </p>
                <p className="item-process-details-desc">
                  {getEmployee(item.employeeId)?.phoneNumber?.length > 0 &&
                    `Employee phone:    ${
                      getEmployee(item.employeeId)?.phoneNumber
                    }`}
                </p>
              </div>
            </div>
          ))}
      </div>
      <AiOutlineClose className="item-process-close" onClick={closeFormModal} />
    </div>
  );
};

export default ItemProcess;
