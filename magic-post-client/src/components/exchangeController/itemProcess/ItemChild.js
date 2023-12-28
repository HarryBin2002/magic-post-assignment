import React, { useContext, useEffect, useState } from "react";
import makeRequest from "../../../services/makeRequest";
import { AuthContext } from "../../../context/AuthContext";

const ItemChild = ({ locationId, employeeId }) => {
  const { successMessage, errorMessage, setCurrentUser, currentUser } =
    useContext(AuthContext);
  const [exchange, setExchange] = useState({});
  const fetchObjectData = async (objectId, objectType) => {
    try {
      const res = await makeRequest.get(
        `/customer/get-info-object?objectId=${objectId}&objectType=${objectType}`,
        {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        }
      );

      if (res.data.status === "Success") {
        // return res.data.data;
        setExchange(res.data.data);
      } else {
        errorMessage("Something went wrong...");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchObjectData(locationId, "EXCHANGE");
  }, []);
  return <div>{exchange?.exchangeAddress}</div>;
};

export default ItemChild;
