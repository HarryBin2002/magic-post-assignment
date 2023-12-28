import React, { useContext, useState } from "react";
import makeRequest from "../../../services/makeRequest";
import { AuthContext } from "../../../context/AuthContext";
import { AiOutlineClose } from "react-icons/ai";
import Loading from "../../loading/loading";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import "./updateItemProcessInChange.scss";

const UpdateItemProcessInChange = ({ closeFormModal, item }) => {
  const { successMessage, errorMessage, currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();
  const [exchangeId, setExchangeId] = useState("");
  const [userReceivedStatus, setUserReceivedStatus] = useState("");

  const updateItemProcessExchange = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      exchangeId.length <= 0 &&
      gatheringId.length <= 0 &&
      (userReceivedStatus === "" || userReceivedStatus === "NONE")
    ) {
      errorMessage("Please provide the next exchange or gathering!");
      setLoading(false);
      return;
    }

    await makeRequest
      .post(
        "/exchange/update-item-process-in-exchange",
        {
          exchangeId: exchangeId,
          itemId: item?.id,
          gatheringId: gatheringId,
          userReceivedStatus:
            userReceivedStatus !== "NONE" ? userReceivedStatus : "",
        },
        {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        }
      )
      .then((res) => {
        if (res.data.status === "Success") {
          successMessage("Update item successful");
          queryClient.invalidateQueries({ queryKey: ["items"] });
          closeFormModal();
        } else {
          errorMessage("Something went wrong...");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        errorMessage("Something went wrong...");
        setLoading(false);
      });
  };

  const updateItemProcessGathering = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      exchangeId.length <= 0 &&
      gatheringId.length <= 0 &&
      (userReceivedStatus === "" || userReceivedStatus === "NONE")
    ) {
      errorMessage("Please provide the next exchange or gathering!");
      setLoading(false);
      return;
    }

    await makeRequest
      .post(
        "/gathering/update-item-process-in-gathering",
        {
          exchangeId: exchangeId,
          itemId: item?.id,
          gatheringId: gatheringId,
          userReceivedStatus:
            userReceivedStatus !== "NONE" ? userReceivedStatus : "",
        },
        {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        }
      )
      .then((res) => {
        if (res.data.status === "Success") {
          successMessage("Update item successful");
          queryClient.invalidateQueries({ queryKey: ["items"] });
          closeFormModal();
        } else {
          errorMessage("Something went wrong...");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        errorMessage("Something went wrong...");
        setLoading(false);
      });
  };

  const [openExchange, setOpenExchange] = useState(false);
  const [openGathering, setOpenGathering] = useState(false);

  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const prevPage = () => {
    page > 0 && setPage(page - 1);
  };

  const nextPage = () => {
    page + 1 < totalPage && setPage(page + 1);
  };

  const {
    isLoading: loadingExchange,
    data: dataExchange,
    error: errorExchange,
  } = useQuery({
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

  const {
    isLoading: loadingGathering,
    data: dataGathering,
    error: errorGathering,
  } = useQuery({
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

  const [gatheringId, setGatheringId] = useState("");

  return (
    <div class="update-process-change">
      {loading && <Loading />}
      <div className="update-process-change-container">
        <form
          className="update-process-change-form"
          onSubmit={
            currentUser.role === "EMPLOYEE_OF_COMMODITY_GATHERING"
              ? updateItemProcessGathering
              : updateItemProcessExchange
          }
        >
          <div className="update-process-change-form-group">
            <div className="update-process-change-list-btn">
              {currentUser.role !== "EMPLOYEE_OF_COMMODITY_EXCHANGE" && (
                <button
                  className="update-process-change-assign"
                  type="button"
                  onClick={() => {
                    setOpenExchange(true);
                    setOpenGathering(false);
                    setGatheringId("");
                  }}
                >
                  Choose exchange
                </button>
              )}
              <button
                className="update-process-change-assign"
                type="button"
                onClick={() => {
                  setOpenGathering(true);
                  setOpenExchange(false);
                  setExchangeId("");
                }}
              >
                Choose gathering
              </button>
            </div>

            {openGathering && (
              <div className="update-process-change-list-leader">
                {loadingGathering ? (
                  <Loading />
                ) : errorGathering ? (
                  errorMessage("Something went wrong")
                ) : dataGathering?.length === 0 ? (
                  <p>Not have any gathering</p>
                ) : (
                  dataGathering?.map((u, i) => (
                    <div
                      className="update-process-change-list-item"
                      key={i}
                      onClick={() => {
                        setGatheringId(u.id);
                        setOpenGathering(false);
                      }}
                    >
                      <p className="update-process-change-list-item-name">
                        {u.gatheringAddress}
                      </p>
                    </div>
                  ))
                )}
                {totalPage > 0 && (
                  <div class="pagination update-process-change-p">
                    <button
                      className="pagination-btn prev-btn update-process-change-p"
                      type="button"
                      onClick={prevPage}
                    >
                      Prev
                    </button>
                    <p className="pagination-current update-process-change-p">
                      {page + 1} / {totalPage}
                    </p>
                    <button
                      className="pagination-btn next-btn update-process-change-p"
                      type="button"
                      onClick={nextPage}
                    >
                      Next
                    </button>
                  </div>
                )}
                <div
                  className="update-process-change-leader-close"
                  onClick={() => {
                    setOpenExchange(false);
                    setOpenGathering(false);
                    setPage(0);
                  }}
                >
                  <AiOutlineClose />
                </div>
              </div>
            )}

            {openExchange && (
              <div className="update-process-change-list-leader">
                {loadingExchange ? (
                  <Loading />
                ) : errorExchange ? (
                  errorMessage("Something went wrong")
                ) : dataExchange?.length === 0 ? (
                  <p>Not have any exchange</p>
                ) : (
                  dataExchange?.map((u, i) => (
                    <div
                      className="update-process-change-list-item"
                      key={i}
                      onClick={() => {
                        setExchangeId(u.id);
                        setOpenExchange(false);
                      }}
                    >
                      <p className="update-process-change-list-item-name">
                        {u.exchangeAddress}
                      </p>
                    </div>
                  ))
                )}
                {totalPage > 0 && (
                  <div class="pagination update-process-change-p">
                    <button
                      className="pagination-btn prev-btn update-process-change-p"
                      type="button"
                      onClick={prevPage}
                    >
                      Prev
                    </button>
                    <p className="pagination-current update-process-change-p">
                      {page + 1} / {totalPage}
                    </p>
                    <button
                      className="pagination-btn next-btn update-process-change-p"
                      type="button"
                      onClick={nextPage}
                    >
                      Next
                    </button>
                  </div>
                )}
                <div
                  className="update-process-change-leader-close"
                  onClick={() => {
                    setOpenExchange(false);
                    setOpenGathering(false);
                    setPage(0);
                  }}
                >
                  <AiOutlineClose />
                </div>
              </div>
            )}

            {currentUser.role !== "EMPLOYEE_OF_COMMODITY_EXCHANGE" &&
              exchangeId.length > 0 && (
                <div className="update-process-change-input-controller">
                  <p className="update-process-change-input-label">
                    Exchange:{" "}
                  </p>
                  <input
                    type="text"
                    placeholder="Exchange"
                    className="update-process-change-input"
                    name="exchangeId"
                    value={exchangeId}
                    onChange={() => {}}
                  />
                </div>
              )}
            {gatheringId.length > 0 && (
              <div className="update-process-change-input-controller">
                <p className="update-process-change-input-label">Gathering: </p>
                <input
                  type="text"
                  placeholder="Gathering ID"
                  className="update-process-change-input"
                  name="gatheringId"
                  value={gatheringId}
                  onChange={() => {}}
                />
              </div>
            )}
            <div className="update-process-change-input-controller">
              <p className="update-process-change-input-label">Item: </p>
              <input
                type="text"
                placeholder="Item ID"
                className="update-process-change-input"
                name="itemId"
                value={item?.id}
                onChange={() => {}}
                required
              />
            </div>
            {currentUser.role !== "EMPLOYEE_OF_COMMODITY_GATHERING" &&
              item?.itemStatus !== "USER_SENT_TO_EXCHANGE" && (
                <div className="update-process-change-input-controller">
                  <p className="update-process-change-input-label">
                    User received status:{" "}
                  </p>

                  <select
                    className="update-process-change-select"
                    onChange={(e) => setUserReceivedStatus(e.target.value)}
                    name="userReceivedStatus"
                  >
                    <option
                      className="update-process-change-option"
                      value="NONE"
                    >
                      NONE
                    </option>
                    <option
                      className="update-process-change-option"
                      value="USER_RECEIVED_FAILED"
                    >
                      USER_RECEIVED_FAILED
                    </option>
                    <option
                      className="update-process-change-option"
                      value="USER_RECEIVED_SUCCESSFUL"
                    >
                      USER_RECEIVED_SUCCESSFUL
                    </option>
                  </select>
                  {/* <input
                type="text"
                placeholder="User received status"
                className="update-process-change-input"
                name="userReceivedStatus"
                value={userReceivedStatus}
                required
              /> */}
                </div>
              )}
          </div>

          <button className="update-process-change-btn" type="submit">
            Submit
          </button>
        </form>
      </div>
      <AiOutlineClose
        className="update-process-change-close"
        onClick={closeFormModal}
      />
    </div>
  );
};

export default UpdateItemProcessInChange;
