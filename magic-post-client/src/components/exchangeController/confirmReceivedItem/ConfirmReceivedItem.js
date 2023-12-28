import React, { useContext, useEffect, useState } from "react";
import makeRequest from "../../../services/makeRequest";
import { AuthContext } from "../../../context/AuthContext";
import { AiOutlineClose } from "react-icons/ai";
import Loading from "../../loading/loading";
import { inputConfirmReceivedItem } from "../../../helpers/inputHelpers";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import "./confirmReceivedItem.scss";

const ConfirmReceivedItem = ({
  closeFormModal,
  setDataItem,
  setOpenReceipt,
}) => {
  const { successMessage, errorMessage, currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    itemDescription: "",
    itemName: "",
    itemType: "",
    itemMass: "",
  });

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const queryClient = useQueryClient();
  const [exchangeId, setExchangeId] = useState("");

  const confirmReceivedItem = async (e) => {
    e.preventDefault();
    setLoading(true);

    await makeRequest
      .post(
        "/exchange/confirm-received-item",
        {
          exchangeId: exchangeId,
          itemDescription: values["itemDescription"],
          itemMass: values["itemMass"],
          itemName: values["itemName"],
          itemType: values["itemType"],
          receivingItemUserId: userReceiveId,
          sendingItemUserId: userSendId,
        },
        {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        }
      )
      .then((res) => {
        setDataItem(res.data.data);
        successMessage("Create item successful");
        queryClient.invalidateQueries({ queryKey: ["items"] });
        setTimeout(() => {
          setOpenReceipt(true);
        }, 800);
        setLoading(false);
        closeFormModal();
      })
      .catch((err) => {
        errorMessage("Something went wrong...");
        setLoading(false);
      });
  };

  // get list exchange
  const [openExchange, setOpenExchange] = useState(false);
  const [openUserSend, setOpenUserSend] = useState(false);
  const [openUserReceive, setOpenUserReceive] = useState(false);

  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const [pageUserSent, setPageUserSent] = useState(0);
  const [totalPageUserSent, setTotalPageUserSent] = useState(0);

  const [pageUserReceive, setPageUserReceive] = useState(0);
  const [totalPageUserReceive, setTotalPageUserReceive] = useState(0);

  const prevPage = async () => {
    if (openExchange) {
      page > 0 && setPage(page - 1);
    } else if (openUserSend) {
      pageUserSent > 0 && setPageUserSent(pageUserSent - 1);
      await handleFilterUser(pageUserSent);
    } else if (openUserReceive) {
      pageUserReceive > 0 && setPageUserReceive(pageUserReceive - 1);
      await handleFilterUser(pageUserReceive);
    }
  };

  const nextPage = async () => {
    if (openExchange) {
      page + 1 < totalPage && setPage(page + 1);
    } else if (openUserSend) {
      pageUserSent + 1 < totalPageUserSent && setPageUserSent(pageUserSent + 1);
      await handleFilterUser(pageUserSent);
    } else if (openUserReceive) {
      pageUserReceive + 1 < totalPageUserReceive &&
        setPageUserReceive(pageUserReceive + 1);
      await handleFilterUser(pageUserReceive);
    }
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
          console.log(res.data.data);
          setTotalPage(res.data.pagination.totalPage);
          return res.data.data;
        }),
  });

  // users
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [listUser, setListUser] = useState([]);

  const handleFilterUser = async (page) => {
    setLoading(true);

    await makeRequest
      .post(
        `/listing/get-list-normal-user?page=${page}`,
        {
          normalUserEmail: email,
          normalUserName: username,
        },
        {
          headers: { Authorization: "Bearer " + currentUser.accessToken },
        }
      )
      .then((res) => {
        setListUser(res.data.data);
        if (openUserSend) {
          setTotalPageUserSent(res.data.pagination.totalPage);
        } else if (openUserReceive) {
          setTotalPageUserReceive(res.data.pagination.totalPage);
        }
        if (listUser.length <= 0) {
          setMsg("Not have any user match.");
        }
        setLoading(false);
      })
      .catch((err) => {
        errorMessage("Something went wrong...");
        setLoading(false);
      });
  };

  // users
  const [userSendId, setUserSendId] = useState("");
  const [userReceiveId, setUserReceiveId] = useState("");

  // get list users by role
  const [msg, setMsg] = useState("");

  return (
    <div class="confirm-item">
      <div className="confirm-item-container">
        <form className="confirm-item-form" onSubmit={confirmReceivedItem}>
          <div className="confirm-item-form-group">
            <div className="confirm-item-list-btn">
              <button
                className={
                  openExchange
                    ? "confirm-item-assign active"
                    : "confirm-item-assign"
                }
                type="button"
                onClick={() => {
                  setOpenExchange(true);
                  setOpenUserSend(false);
                  setOpenUserReceive(false);
                  setUsername("");
                  setEmail("");
                  setListUser([]);
                  setMsg("");
                }}
              >
                Choose exchange
              </button>
              <button
                className={
                  openUserSend
                    ? "confirm-item-assign active"
                    : "confirm-item-assign"
                }
                type="button"
                onClick={() => {
                  setOpenUserSend(true);
                  setOpenExchange(false);
                  setOpenUserReceive(false);
                }}
              >
                Chose sent user
              </button>
              <button
                className={
                  openUserReceive
                    ? "confirm-item-assign active"
                    : "confirm-item-assign"
                }
                type="button"
                onClick={() => {
                  setOpenUserReceive(true);
                  setOpenUserSend(false);
                  setOpenExchange(false);
                  setUsername("");
                  setEmail("");
                  setListUser([]);
                  setMsg("");
                }}
              >
                Chose received user
              </button>
            </div>

            {openUserSend && (
              <div className="confirm-item-list-leader">
                <div className="confirm-item-list-user-send">
                  <input
                    type="text"
                    className="confirm-item-list-user-send-input"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    type="text"
                    className="confirm-item-list-user-send-input"
                    placeholder="User name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <button
                    type="button"
                    className="confirm-item-list-user-send-find"
                    onClick={() => handleFilterUser(pageUserSent)}
                  >
                    Find
                  </button>
                </div>
                {loading ? (
                  <Loading />
                ) : listUser?.length <= 0 ? (
                  <p
                    style={{
                      textAlign: "center",
                      color: "red",
                      marginTop: "20px",
                      fontSize: "14px",
                    }}
                  >
                    {msg}
                  </p>
                ) : (
                  listUser?.map((u, i) => (
                    <div
                      className="confirm-item-list-item"
                      key={i}
                      onClick={() => {
                        setUserSendId(u.userId);
                        setOpenUserSend(false);
                      }}
                    >
                      <p className="confirm-item-list-item-name">
                        {u.name} with {u.email}
                      </p>
                    </div>
                  ))
                )}
                {totalPageUserSent > 0 && listUser?.length > 0 && (
                  <div class="pagination confirm-item-p">
                    <button
                      className="pagination-btn prev-btn confirm-item-p"
                      type="button"
                      onClick={prevPage}
                    >
                      Prev
                    </button>
                    <p className="pagination-current confirm-item-p">
                      {pageUserSent + 1} / {totalPageUserSent}
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
                    setOpenExchange(false);
                    setOpenUserSend(false);
                    setOpenUserReceive(false);
                    setPage(0);
                    setUsername("");
                    setEmail("");
                    setListUser([]);
                    setMsg("");
                  }}
                >
                  <AiOutlineClose />
                </div>
              </div>
            )}

            {openUserReceive && (
              <div className="confirm-item-list-leader">
                <div className="confirm-item-list-user-send">
                  <input
                    type="text"
                    className="confirm-item-list-user-send-input"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    type="text"
                    className="confirm-item-list-user-send-input"
                    placeholder="User name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <button
                    type="button"
                    className="confirm-item-list-user-send-find"
                    onClick={() => handleFilterUser(pageUserReceive)}
                  >
                    Find
                  </button>
                </div>
                {loading ? (
                  <Loading />
                ) : listUser?.length <= 0 ? (
                  <p
                    style={{
                      textAlign: "center",
                      color: "red",
                      marginTop: "20px",
                      fontSize: "14px",
                    }}
                  >
                    {msg}
                  </p>
                ) : (
                  listUser?.map((u, i) => (
                    <div
                      className="confirm-item-list-item"
                      key={i}
                      onClick={() => {
                        setUserReceiveId(u.userId);
                        setOpenUserReceive(false);
                      }}
                    >
                      <p className="confirm-item-list-item-name">
                        {u.name} with {u.email}
                      </p>
                    </div>
                  ))
                )}
                {totalPageUserReceive > 0 && listUser?.length > 0 && (
                  <div class="pagination confirm-item-p">
                    <button
                      className="pagination-btn prev-btn confirm-item-p"
                      type="button"
                      onClick={prevPage}
                    >
                      Prev
                    </button>
                    <p className="pagination-current confirm-item-p">
                      {pageUserReceive + 1} / {totalPageUserReceive}
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
                    setOpenExchange(false);
                    setOpenUserSend(false);
                    setOpenUserReceive(false);
                    setPage(0);
                    setUsername("");
                    setEmail("");
                    setListUser([]);
                    setMsg("");
                  }}
                >
                  <AiOutlineClose />
                </div>
              </div>
            )}

            {openExchange && (
              <div className="confirm-item-list-leader">
                {isLoading ? (
                  <Loading />
                ) : error ? (
                  errorMessage("Something went wrong")
                ) : data?.length <= 0 ? (
                  <p>Not have any exchange</p>
                ) : (
                  data?.map((u, i) => (
                    <div
                      className="confirm-item-list-item"
                      key={i}
                      onClick={() => {
                        setExchangeId(u.id);
                        setOpenExchange(false);
                      }}
                    >
                      <p className="confirm-item-list-item-name">
                        {u.exchangeAddress}
                      </p>
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
                    setOpenExchange(false);
                    setOpenUserSend(false);
                    setOpenUserReceive(false);
                    setPage(0);
                  }}
                >
                  <AiOutlineClose />
                </div>
              </div>
            )}

            <div className="confirm-item-input-controller">
              <p className="confirm-item-input-label">Exchange: </p>
              <input
                type="text"
                placeholder="Exchange"
                className="confirm-item-input"
                name="exchangeId"
                value={exchangeId}
                onChange={() => {}}
                required
              />
            </div>
            {inputConfirmReceivedItem.map((item, index) => (
              <div className="confirm-item-input-controller">
                <p className="confirm-item-input-label">{item.placeholder}: </p>
                <input
                  className="confirm-item-input"
                  type={item.type}
                  placeholder={item.placeholder}
                  name={item.name}
                  value={values[item.name]}
                  onChange={onChange}
                  required
                  key={index}
                />
              </div>
            ))}
            <div className="confirm-item-input-controller">
              <p className="confirm-item-input-label">User sent: </p>
              <input
                type="text"
                placeholder="User send"
                className="confirm-item-input"
                name="userSendId"
                value={userSendId}
                onChange={() => {}}
                required
              />
            </div>
            <div className="confirm-item-input-controller">
              <p className="confirm-item-input-label">User received: </p>
              <input
                type="text"
                placeholder="User receive"
                className="confirm-item-input"
                name="userReceiveId"
                value={userReceiveId}
                onChange={() => {}}
                required
              />
            </div>
          </div>

          <button className="confirm-item-btn" type="submit">
            Submit
          </button>
        </form>
      </div>
      <AiOutlineClose className="confirm-item-close" onClick={closeFormModal} />
    </div>
  );
};

export default ConfirmReceivedItem;
