import { useContext } from "react";
import MainTable from "../mainTable/MainTable";
import ManageExchange from "../manageExchange/ManageExchange";
import ManageGathering from "../manageGathering/ManageGathering";
import "./main.scss";
import { AuthContext } from "../../context/AuthContext";
import ManageItem from "../manageItems/ManageItem";
import ManagerManageItem from "../managerController/ManagerManageItem";
import LeaderExchangeManageItem from "../managerController/LeaderExchangeManageItem";
import CustomerManageItem from "../manageItems/CustomerManageItem";
import ManageEmployee from "../mainTable/ManageEmployee";

const Main = ({ selectedMenu }) => {
  const { currentUser } = useContext(AuthContext);

  const caseManager = () => {
    switch (selectedMenu) {
      case "User":
        if (currentUser?.role === "LEADER_OF_COMMODITY_GATHERING") {
          return <ManageEmployee title="Employee gathering" />;
        } else if (currentUser?.role === "LEADER_OF_COMMODITY_EXCHANGE") {
          return <ManageEmployee title="Employee exchange" />;
        } else if (currentUser?.role === "MANAGER") {
          return <MainTable title="Leader" />;
        }
        return <MainTable title="Employee" />;
      case "Exchange":
        return <ManageExchange />;
      case "Gathering":
        return <ManageGathering />;
      case "Items":
        if (currentUser?.role === "MANAGER") {
          return <ManagerManageItem />;
        } else if (currentUser?.role === "LEADER_OF_COMMODITY_EXCHANGE") {
          return <LeaderExchangeManageItem />;
        } else if (currentUser?.role === "LEADER_OF_COMMODITY_GATHERING") {
          return <LeaderExchangeManageItem />;
        } else if (currentUser?.role === "USER_NORMAL") {
          return <CustomerManageItem />;
        }
        return <ManageItem />;
      default:
        break;
    }
  };

  return <div className="main">{caseManager()}</div>;
};

export default Main;
