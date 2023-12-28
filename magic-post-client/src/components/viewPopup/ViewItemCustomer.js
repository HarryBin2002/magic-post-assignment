import "./viewItemCustomer.scss";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../loading/loading";
import { AiOutlineClose } from "react-icons/ai";
import makeRequest from "../../services/makeRequest";
import { useQuery } from "@tanstack/react-query";
import ItemProcess from "../exchangeController/itemProcess/ItemProcess";
import moment from "moment";
import { MdDone } from "react-icons/md";

const ViewItemCustomer = ({ closeVisible, item }) => {
  const { successMessage, errorMessage, currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

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
      const locationPromises = item?.itemProcess
        .filter((item) => item.locationId)
        .map((item) => fetchLocation(item.locationId, item.locationType));

      const employeePromises = item?.itemProcess
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
  }, [item?.itemProcess, currentUser.accessToken]);

  const getLocationItem = (locationId) => {
    const location = locations.find((loc) => loc?.id === locationId);
    return location;
  };

  const getEmployee = (employeeId) => {
    const employee = employees.find((emp) => emp?.userId === employeeId);
    return employee;
  };

  return (
    <div class="view-popup-customer">
      {loading && <Loading />}
      <div className="view-popup-customer-container">
        <h2 className="view-popup-customer-title">Details information</h2>

        <div className="view-popup-customer-box">
          <div
            className="view-popup-customer-sender"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <div>
              <h3
                style={{
                  color: "black",
                  textDecoration: "underline",
                  marginBottom: "5px",
                }}
              >
                To:
              </h3>
              <p>Name: {item?.receivingItemUser?.name}</p>
              <p>Address: {item?.receivingItemUser?.address}</p>
              <p>Phone: {item?.receivingItemUser?.phoneNumber}</p>
            </div>
          </div>
          {/*  */}
          <h3
            style={{
              color: "black",
              textDecoration: "underline",
              marginBottom: "5px",
            }}
          >
            Item information:
          </h3>
          <div style={{ display: "flex", gap: "5px" }}>
            <p>Name:</p>
            <p>{item.itemName}</p>
          </div>
          <div style={{ display: "flex", gap: "5px" }}>
            <p>Type:</p>
            <p>{item.itemType}</p>
          </div>
          <div style={{ display: "flex", gap: "5px" }}>
            <p>Mass:</p>
            <p>{item.itemMass}</p>
          </div>
          <div style={{ display: "flex", gap: "5px" }}>
            <p>Description:</p>
            <p>{item.itemDescription}</p>
          </div>
          <div style={{ display: "flex", gap: "5px" }}>
            <p>Status:</p>
            <p>{item.itemStatus}</p>
          </div>
          {/*  */}
          <h3
            style={{
              color: "black",
              textDecoration: "underline",
              margin: "15px 0",
            }}
          >
            Process:
          </h3>
          <div
            className="view-popup-customer-process"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "10px 0",
            }}
          >
            {item?.itemProcess
              ?.slice()
              .reverse()
              .map((item, index) => (
                <div className="item-process-child" key={index}>
                  <p className="item-process-time">
                    {formatTime(item.commitTime)}
                  </p>
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
                    <p
                      className={
                        index === 0
                          ? "item-process-description active"
                          : "item-process-description"
                      }
                    >
                      {item.description}
                    </p>
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
                        `Employee name:    ${
                          getEmployee(item.employeeId)?.name
                        }`}
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
        </div>
      </div>
      <AiOutlineClose
        className="view-popup-customer-close"
        onClick={closeVisible}
      />
    </div>
  );
};

export default ViewItemCustomer;
