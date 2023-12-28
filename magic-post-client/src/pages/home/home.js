import { useContext, useEffect, useState } from "react";
import UnAuthorized from "../../UnAuthorized";
import Sidebar from "../../components/sidebar/sidebar";
import Main from "../../components/main/Main";
import "./home.scss";
import Intro from "../intro/Intro";
import { useQuery } from "@tanstack/react-query";
import makeRequest from "../../services/makeRequest";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../../components/loading/loading";

const Home = () => {
  const { currentUser, setCurrentUser, errorMessage, successMessage } =
    useContext(AuthContext);
  const [showTopSub, setShowTopSub] = useState(false);
  const [isPage401, setIsPage401] = useState(false);

  // unauthorized page
  // useEffect(() => {
  //   if (errorPage) {
  //     setIsPage401(true);
  //   }
  // }, [errorPage]);
  const [selectedMenu, setSelectedMenu] = useState("");
  useEffect(() => {
    if (currentUser.role === "USER_NORMAL") {
      setSelectedMenu("Items");
    } else if (currentUser.role === "EMPLOYEE_OF_COMMODITY_GATHERING") {
      setSelectedMenu("Items");
    } else if (currentUser.role === "EMPLOYEE_OF_COMMODITY_EXCHANGE") {
      setSelectedMenu("Items");
    } else {
      setSelectedMenu("User");
    }
  }, [currentUser.role]);
  const onChangeMenu = (selectedMenu) => {
    setSelectedMenu(selectedMenu);
  };

  const { isLoading, data, error } = useQuery({
    queryKey: ["my-role"],
    queryFn: () =>
      makeRequest
        .get(`/user/get-user-info`, {
          headers: { Authorization: `Bearer ${currentUser?.accessToken}` },
        })
        .then((res) => {
          return res.data.data;
        }),
  });
  if (isLoading) {
    return <Loading />;
  } else {
    if (error) {
      return errorMessage("Something went wrong");
    } else {
      currentUser.role = data?.role;
      currentUser.name = data?.name;
      currentUser.email = data?.email;
      localStorage.setItem("userData", JSON.stringify(currentUser));
      return (
        <div className={isPage401 ? "home unauthorized" : "home"}>
          <Sidebar selectedMenu={selectedMenu} onChangeMenu={onChangeMenu} />
          <Main selectedMenu={selectedMenu} />
          {/* {isPage401 && (
            <UnAuthorized
              setIsPage401={setIsPage401}
              setCurrentUser={setCurrentUser}
            />
          )} */}
          <div className="home-user-info">
              <p>{currentUser?.name} --- {currentUser?.email}</p>
          </div>
        </div>
      );
    }
  }
};

export default Home;
