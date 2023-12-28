import { useContext, useState } from "react";
import "./mainTable.scss";
import { MdOutlineAdd } from "react-icons/md";
import FormModal from "../formModal/FormExchangeModal";
import ManageUser from "../manage_users/ManageUser";
import FilterExchange from "../filterPopup/FilterExchange";
import FormLeader from "../formModal/FormLeader";
import { AuthContext } from "../../context/AuthContext";
import makeRequest from "../../services/makeRequest";
import { useQuery } from "@tanstack/react-query";
import FormEmployee from "../exchangeController/addEmployeeAccount/FormEmployeeExchange";

const MainTable = ({ title }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [role, setRole] = useState("LEADER_OF_COMMODITY_EXCHANGE");
  const [isFilterExchange, setIsFilterExchange] = useState(false);
  const { currentUser } = useContext(AuthContext);

  // Open modal
  const openFormModal = () => setIsOpenModal(true);
  // Close modal
  const closeFormModal = () => setIsOpenModal(false);

  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const prevPage = () => {
    page > 0 && setPage(page - 1);
  };

  const nextPage = () => {
    page + 1 < totalPage && setPage(page + 1);
  };

  const { isLoading, data, error } = useQuery({
    queryKey: ["leaders", page, role],
    queryFn: () =>
      makeRequest
        .get(`/manager/get-list-leader?role=${role}&page=${page}`, {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        })
        .then((res) => {
          setTotalPage(res.data.pagination.totalPage);
          return res.data.data;
        }),
  });

  // const {
  //   isLoading: loadingEmployeeGathering,
  //   data: dataEmployeeGathering,
  //   error: errorEmployeeGathering,
  // } = useQuery({
  //   queryKey: ["gathering-employee", page],
  //   queryFn: () =>
  //     makeRequest
  //       .post(
  //         `/listing/get-list-normal-user?page=${page}`,
  //         {},
  //         {
  //           headers: { Authorization: "Bearer " + currentUser.accessToken },
  //         }
  //       )
  //       .then((res) => {
  //         setTotalPage(res.data.pagination.totalPage);
  //         return res.data.data;
  //       }),
  // });

  // on change role
  const onChangeRole = (e) => setRole(e.target.value);

  // open filter exchange
  const openFilterExchange = () => setIsFilterExchange(true);
  // close filter exchange
  const closeFilterExchange = () => setIsFilterExchange(false);

  return (
    <div className="main-table">
      <div className="main-table-container">
        <div className="main-table-top">
          <h2 className="main-table-title">{title} management</h2>
          <div className="main-table-top-actions">
            {title === "Exchange" && (
              <button
                className="main-table-filter"
                onClick={openFilterExchange}
              >
                Filters
              </button>
            )}
            {title === "Leader" && (
              <div className="main-table-select-option">
                <select
                  name="roles"
                  id="roles"
                  className="main-table-roles"
                  onChange={(e) => onChangeRole(e)}
                >
                  <option
                    className="main-table-role-option"
                    value="LEADER_OF_COMMODITY_EXCHANGE"
                  >
                    LEADER_OF_COMMODITY_EXCHANGE
                  </option>
                  <option
                    className="main-table-role-option"
                    value="LEADER_OF_COMMODITY_GATHERING"
                  >
                    LEADER_OF_COMMODITY_GATHERING
                  </option>
                </select>
              </div>
            )}
            <button className="btn-add" onClick={openFormModal}>
              <p>Add new {title.toLowerCase()}</p>
              <MdOutlineAdd />
            </button>
          </div>
        </div>
        {title === "Leader" && (
          <ManageUser isLoading={isLoading} error={error} data={data} />
        )}
        {/* {title === "Employee gathering" && (
          <ManageEmployeeGathering
            isLoading={loadingEmployeeGathering}
            error={errorEmployeeGathering}
            data={dataEmployeeGathering}
          />
        )} */}
      </div>
      {totalPage > 0 && (
        <div class="pagination">
          <button className="pagination-btn prev-btn" onClick={prevPage}>
            Prev
          </button>
          <p className="pagination-current">
            {page + 1} / {totalPage}
          </p>
          <button className="pagination-btn next-btn" onClick={nextPage}>
            Next
          </button>
        </div>
      )}

      {isOpenModal && title === "Exchange" && (
        <FormModal closeFormModal={closeFormModal} />
      )}

      {isOpenModal &&
        title === "Employee" && ( // old: User
          <FormEmployee
            closeFormModal={closeFormModal}
            role={
              currentUser?.role === "LEADER_OF_COMMODITY_EXCHANGE"
                ? "EMPLOYEE_OF_COMMODITY_EXCHANGE"
                : "EMPLOYEE_OF_COMMODITY_GATHERING"
            }
          />
        )}

      {isOpenModal && title === "Leader" && (
        <FormLeader closeFormModal={closeFormModal} />
      )}

      {isFilterExchange && title === "Exchange" && (
        <FilterExchange closeFilterExchange={closeFilterExchange} />
      )}
    </div>
  );
};

export default MainTable;
