import { useContext, useEffect, useState } from "react";
import "./manageGathering.scss";
import { MdOutlineAdd } from "react-icons/md";
import FilterExchange from "../filterPopup/FilterExchange";
import Table from "../table/Table";
import Pagination from "../../commons/Pagination";
import { AuthContext } from "../../context/AuthContext";
import makeRequest from "../../services/makeRequest";
import Loading from "../loading/loading";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import FormGatheringModal from "../formModal/FormGatheringModal";
import TableGathering from "../table/TableGathering";

const ManageGathering = () => {
  const { currentUser, errorMessage } = useContext(AuthContext);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isFilterGathering, setIsFilterGathering] = useState(false);

  // Open modal
  const openFormModal = () => setIsOpenModal(true);
  // Close modal
  const closeFormModal = () => setIsOpenModal(false);

  // open filter exchange
  const openFilterExchange = () => setIsFilterGathering(true);
  // close filter exchange
  const closeFilterExchange = () => setIsFilterGathering(false);

  // Handle filters exchange
  const [currentGathering, setCurrentGathering] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const getFilterExchange = (data) => setCurrentGathering(data);

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
    queryKey: ["gatherings", page],
    queryFn: () =>
      makeRequest
        .post(
          `/listing/get-list-gathering?page=${page}`,
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
    <div className="manage-gathering">
      <div className="manage-gathering-container">
        <div className="manage-gathering-header">
          <h2 className="manage-gathering-title">Gathering management</h2>
          <div className="manage-gathering-actions">
            {isFiltering ? (
              <button
                className="manage-gathering-filter"
                onClick={() => {
                  setIsFiltering(false);
                  queryClient.invalidateQueries(["gatherings"]);
                }}
              >
                Remove Filter
              </button>
            ) : (
              <button
                className="manage-gathering-filter"
                onClick={openFilterExchange}
              >
                Filter
              </button>
            )}
            <button className="btn-add" onClick={openFormModal}>
              <p>Add new gathering</p>
              <MdOutlineAdd />
            </button>
          </div>
        </div>
        <TableGathering
          name="Gathering"
          dataGathering={data}
          isFiltering={isFiltering}
          currentGathering={currentGathering}
        />
      </div>

      {/* <Pagination /> */}
      {totalPage > 0 && (
        <div class="pagination">
          <button
            className="pagination-btn prev-btn"
            // disabled={page < 1}
            onClick={prevPage}
          >
            Prev
          </button>
          <p className="pagination-current">
            {page + 1} / {totalPage}
          </p>
          <button
            className="pagination-btn next-btn"
            // disabled={page + 1 < totalPage}
            onClick={nextPage}
          >
            Next
          </button>
        </div>
      )}

      {isOpenModal && (
        <FormGatheringModal closeFormModal={closeFormModal} item={{}} />
      )}

      {isFilterGathering && (
        <FilterExchange
          closeFilterExchange={closeFilterExchange}
          getFilterExchange={getFilterExchange}
          setIsFiltering={setIsFiltering}
        />
      )}
    </div>
  );
};

export default ManageGathering;
