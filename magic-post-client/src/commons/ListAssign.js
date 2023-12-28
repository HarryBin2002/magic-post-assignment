import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Loading from "../components/loading/loading";
import { AiOutlineClose } from "react-icons/ai";

const ListAssign = ({
  openListUser,
  isLoading,
  error,
  dataList,
  setIdSelect,
  setCloseList,
  setOpenList,
  totalPage
}) => {
  const { errorMessage } = useContext(AuthContext);
  const [page, setPage] = useState(0);

  const prevPage = () => {
    page > 0 && setPage(page - 1);
  };

  const nextPage = () => {
    page + 1 < totalPage && setPage(page + 1);
  };

  return (
    <div className="confirm-item-list-leader">
      {openListUser && <div className="confirm-item-list-user-send"></div>}
      {isLoading ? (
        <Loading />
      ) : error ? (
        errorMessage("Something went wrong")
      ) : dataList?.length === 0 ? (
        <p>Not have any exchange</p>
      ) : (
        dataList?.map((u, i) => (
          <div
            className="confirm-item-list-item"
            key={i}
            onClick={() => {
              setIdSelect(u.id);
              setCloseList(false);
            }}
          >
            <p className="confirm-item-list-item-name">{u.exchangeAddress}</p>
          </div>
        ))
      )}

      {totalPage > 0 && (
        <div class="pagination confirm-item-p">
          <button
            className="pagination-btn prev-btn confirm-item-p"
            type="button"
            onClick={prevPage}
          >
            Prev
          </button>
          <p className="pagination-current confirm-item-p">
            {page + 1} / {totalPage}
          </p>
          <button
            className="pagination-btn next-btn confirm-item-p"
            type="button"
            onClick={nextPage}
          >
            Next
          </button>
        </div>
      )}

      <div
        className="confirm-item-leader-close"
        onClick={() => {
          setOpenList(false);
          setPage(0);
        }}
      >
        <AiOutlineClose />
      </div>
    </div>
  );
};

export default ListAssign;
