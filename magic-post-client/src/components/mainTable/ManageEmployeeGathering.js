import { useContext, useState } from "react";
import "./mainTable.scss";
import { MdOutlineAdd } from "react-icons/md";
import FilterExchange from "../filterPopup/FilterExchange";
import FormEmployeeExchange from "../exchangeController/addEmployeeAccount/FormEmployeeExchange";
import { AuthContext } from "../../context/AuthContext";
import makeRequest from "../../services/makeRequest";
import { useQuery } from "@tanstack/react-query";
import EmployeeTable from "../manage_users/EmployeeTable";

const ManageEmployeeGathering = ({ title }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
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

  const role = "EMPLOYEE_OF_COMMODITY_EXCHANGE";

  const { isLoading, data, error } = useQuery({
    queryKey: ["exchange-employee", page],
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

  // open filter exchange
  const openFilterExchange = () => setIsFilterExchange(true);
  // close filter exchange
  const closeFilterExchange = () => setIsFilterExchange(false);

  return (
    <div className="main-table">
      <div className="main-table-container">
        <div className="main-table-top">
          <h2 className="main-table-title">Employee management</h2>
          <div className="main-table-top-actions">
            {title === "Exchange" && (
              <button
                className="main-table-filter"
                onClick={openFilterExchange}
              >
                Filters
              </button>
            )}
            <button className="btn-add" onClick={openFormModal}>
              <p>Add new {title.toLowerCase()}</p>
              <MdOutlineAdd />
            </button>
          </div>
        </div>
        {title === "Employee exchange" && (
          <EmployeeTable isLoading={isLoading} error={error} data={data} />
        )}
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

      {isOpenModal && (
        <FormEmployeeExchange
          closeFormModal={closeFormModal}
          role={
            currentUser?.role === "LEADER_OF_COMMODITY_EXCHANGE"
              ? "EMPLOYEE_OF_COMMODITY_EXCHANGE"
              : "EMPLOYEE_OF_COMMODITY_GATHERING"
          }
        />
      )}

      {isFilterExchange && title === "Exchange" && (
        <FilterExchange closeFilterExchange={closeFilterExchange} />
      )}
    </div>
  );
};

export default ManageEmployeeGathering;
