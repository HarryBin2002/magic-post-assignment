import { useContext, useState } from "react";
import "./managerManageItem.scss";
import { AuthContext } from "../../context/AuthContext";
import makeRequest from "../../services/makeRequest";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import TableItem from "../table/TableItem";

const ManagerManageItem = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [locationType, setLocationType] = useState("EXCHANGE");
  const [itemStatus, setItemStatus] = useState("USER_RECEIVED_SUCCESSFUL");
  const [isFilterExchange, setIsFilterExchange] = useState(false);
  const { currentUser } = useContext(AuthContext);

  // Open modal
  const openFormModal = () => setIsOpenModal(true);
  // Close modal
  const closeFormModal = () => setIsOpenModal(false);

  // on change role
  const onChangeRole = (e) => setLocationType(e.target.value);
  const onChangeItemStatus = (e) => setItemStatus(e.target.value);

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
    queryKey: ["items", page, locationType],
    queryFn: () =>
      makeRequest
        .post(
          `/listing/get-list-item-in-exchange-or-gathering?itemLocationType=${locationType}&page=${page}`,
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
    <div className="main-table">
      <div className="main-table-container">
        <div className="main-table-top">
          <h2 className="main-table-title">Items management</h2>
          <div className="main-table-top-actions">
            {currentUser.role === "MANAGER" && (
              <div className="main-table-select-option">
                <select
                  name="roles"
                  id="roles"
                  className="main-table-roles"
                  onChange={(e) => onChangeRole(e)}
                >
                  <option className="main-table-role-option" value="EXCHANGE">
                    EXCHANGE
                  </option>
                  <option className="main-table-role-option" value="GATHERING">
                    GATHERING
                  </option>
                </select>
              </div>
            )}

            {currentUser.role !== "MANAGER" && (
              <select
                name="roles"
                id="roles"
                className="main-table-roles"
                onChange={(e) => onChangeItemStatus(e)}
              >
                <option
                  className="main-table-role-option"
                  value="USER_RECEIVED_SUCCESSFUL"
                >
                  USER_RECEIVED_SUCCESSFUL
                </option>
                <option
                  className="main-table-role-option"
                  value="USER_RECEIVED_FAILED"
                >
                  USER_RECEIVED_FAILED
                </option>
              </select>
            )}
          </div>
        </div>
        <TableItem
          name="Item"
          dataItem={data}
          isFiltering={false}
          currentItem={[]}
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
    </div>
  );
};

export default ManagerManageItem;
