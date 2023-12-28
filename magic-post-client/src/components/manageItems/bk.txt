import { useContext, useEffect, useState } from "react";
import "./manageItem.scss";
import { MdOutlineAdd } from "react-icons/md";
import FilterExchange from "../filterPopup/FilterExchange";
import Table from "../table/Table";
import Pagination from "../../commons/Pagination";
import { AuthContext } from "../../context/AuthContext";
import makeRequest from "../../services/makeRequest";
import Loading from "../loading/loading";
import FormExchangeModal from "../formModal/FormExchangeModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import TableItem from "../table/TableItem";
import ConfirmReceivedItem from "../exchangeController/confirmReceivedItem/ConfirmReceivedItem";

const ManageItem = () => {
  const { currentUser, errorMessage, successMessage } = useContext(AuthContext);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isFilterExchange, setIsFilterExchange] = useState(false);

  // Open modal
  const openFormModal = () => setIsOpenModal(true);
  // Close modal
  const closeFormModal = () => setIsOpenModal(false);

  // close filter exchange
  const closeFilterItemStatus = () => setIsFilterExchange(false);

  // Handle filters exchange
  const [currentItem, setCurrentItem] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);

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

  const [itemStatus, setItemStatus] = useState("Select item status");

  const itemLocationType =
    currentUser.role === "EMPLOYEE_OF_COMMODITY_EXCHANGE"
      ? "EXCHANGE"
      : "GATHERING";

  const { isLoading, data, error } = useQuery({
    queryKey: ["items", page, itemLocationType],
    queryFn: () =>
      makeRequest
        .post(
          `/listing/get-list-item-in-exchange-or-gathering?itemLocationType=${itemLocationType}&page=${page}`,
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
  const [loading, setLoading] = useState(false);

  const fetchItemStatus = async (itemStatus, itemLocationType) => {
    setPage(0);
    setTotalPage(0);
    setIsFiltering(true);
    setLoading(true);

    try {
      await makeRequest
        .get(
          `/listing/get-list-item-successful-or-failed?itemStatus=${itemStatus}&itemLocationType=${itemLocationType}&page=${page}`,
          {
            headers: { Authorization: `Bearer ${currentUser.accessToken}` },
          }
        )
        .then((res) => {
          setTimeout(() => {
            setCurrentItem(res.data.data);
            setTotalPage(res.data.pagination.totalPage);
            console.log("item status", res.data);
            successMessage("Get items successful");
            setLoading(false);
            closeFilterItemStatus();
          }, 500);
        })
        .catch((err) => {
          console.log(err);
          errorMessage("Something went wrong...");
          setLoading(false);
        });
    } catch (error) {}
  };

  return (
    <div className="manage-item">
      <div className="manage-item-container">
        <div className="manage-item-header">
          <h2 className="manage-item-title">Items management</h2>
          <div className="manage-item-actions">
            {currentUser.role !== "LEADER_OF_COMMODITY_EXCHANGE" &&
              currentUser.role !== "LEADER_OF_COMMODITY_GATHERING" &&
              currentUser.role !== "EMPLOYEE_OF_COMMODITY_GATHERING" && (
                <div className="main-table-select-option">
                  <button
                    className="main-table-role-option"
                    value="EXCHANGER_SENT_TO_USER"
                    onClick={() =>
                      fetchItemStatus(
                        "EXCHANGER_SENT_TO_USER",
                        "USER_RECEIVED_SUCCESSFUL"
                      )
                    }
                  >
                    EXCHANGER_SENT_TO_USER
                  </button>
                  <button
                    className="main-table-role-option"
                    value="USER_SENT_TO_EXCHANGE_AGAIN"
                    onClick={() =>
                      fetchItemStatus("USER_SENT_TO_EXCHANGE_AGAIN", "EXCHANGE")
                    }
                  >
                    USER_SENT_TO_EXCHANGE_AGAIN
                  </button>
                  <button
                    className="main-table-role-option"
                    value="USER_SENT_TO_EXCHANGE_AGAIN"
                    onClick={() => {
                      setLoading(true);
                      setIsFiltering(false);
                      setCurrentItem([]);
                      queryClient.invalidateQueries(["items"]);
                      setLoading(false);
                    }}
                  >
                    Remove filter status
                  </button>
                </div>
              )}
            {currentUser.role === "EMPLOYEE_OF_COMMODITY_EXCHANGE" && (
              <button className="btn-add" onClick={openFormModal}>
                <p>Create new item</p>
                <MdOutlineAdd />
              </button>
            )}
          </div>
        </div>
        <TableItem
          name="Item"
          dataItem={data}
          loading={loading}
          isFiltering={isFiltering}
          currentItem={currentItem}
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

      {currentUser.role !== "LEADER_OF_COMMODITY_EXCHANGE" &&
        currentUser.role !== "LEADER_OF_COMMODITY_GATHERING" &&
        isOpenModal && <ConfirmReceivedItem closeFormModal={closeFormModal} />}
    </div>
  );
};

export default ManageItem;
