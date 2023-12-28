import { useContext, useEffect, useState } from "react";
import "./manageExchange.scss";
import { MdOutlineAdd } from "react-icons/md";
import FilterExchange from "../filterPopup/FilterExchange";
import Table from "../table/Table";
import Pagination from "../../commons/Pagination";
import { AuthContext } from "../../context/AuthContext";
import makeRequest from "../../services/makeRequest";
import Loading from "../loading/loading";
import FormExchangeModal from "../formModal/FormExchangeModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const ManageExchange = () => {
  const { currentUser, errorMessage } = useContext(AuthContext);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isFilterExchange, setIsFilterExchange] = useState(false);

  // Open modal
  const openFormModal = () => setIsOpenModal(true);
  // Close modal
  const closeFormModal = () => setIsOpenModal(false);

  // open filter exchange
  const openFilterExchange = () => setIsFilterExchange(true);
  // close filter exchange
  const closeFilterExchange = () => setIsFilterExchange(false);

  // Handle filters exchange
  const [currentExchange, setCurrentExchange] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const getFilterExchange = (data) => setCurrentExchange(data);

  const queryClient = useQueryClient();

  // pagination
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const prevPage = () => {
    page > 0 && setPage(page - 1);
  };

  const nextPage = () => {
    page + 1 < totalPage && setPage(page + 1);
  };

  const { isLoading, data, error } = useQuery({
    queryKey: ["exchanges", page],
    queryFn: () =>
      makeRequest
        .post(
          `/listing/get-list-exchange?page=${page}`,
          {},
          {
            headers: { Authorization: `Bearer ${currentUser.accessToken}` },
          }
        )
        .then((res) => {
          setTotalPage(res.data.pagination.totalPage);
          return res.data.data;
        }),
  });

  return (
    <div className="manage-exchange">
      <div className="manage-exchange-container">
        <div className="manage-exchange-header">
          <h2 className="manage-exchange-title">Exchange management</h2>
          <div className="manage-exchange-actions">
            {isFiltering ? (
              <button
                className="manage-exchange-filter"
                onClick={() => {
                  setIsFiltering(false);
                  getFilterExchange([]);
                  queryClient.invalidateQueries(["exchanges"]);
                }}
              >
                Remove Filter
              </button>
            ) : (
              <button
                className="manage-exchange-filter"
                onClick={openFilterExchange}
              >
                Filter
              </button>
            )}
            <button className="btn-add" onClick={openFormModal}>
              <p>Add new exchange</p>
              <MdOutlineAdd />
            </button>
          </div>
        </div>
        <Table
          name="Exchange"
          dataExchange={data}
          isFiltering={isFiltering}
          currentExchange={currentExchange}
        />
      </div>

      {/* <Pagination /> */}
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
        <FormExchangeModal closeFormModal={closeFormModal} item={{}} />
      )}

      {isFilterExchange && (
        <FilterExchange
          closeFilterExchange={closeFilterExchange}
          getFilterExchange={getFilterExchange}
          setIsFiltering={setIsFiltering}
        />
      )}
    </div>
  );
};

export default ManageExchange;
