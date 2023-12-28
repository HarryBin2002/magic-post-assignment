import "./formExchangeModal.css";
import { useContext, useState } from "react";
import makeRequest from "../../services/makeRequest";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../loading/loading";
import { AiOutlineClose } from "react-icons/ai";
import { inputFilterExchange } from "../../helpers/inputHelpers";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const FormExchangeModal = ({ closeFormModal, item }) => {
  const { successMessage, errorMessage, currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [leaderId, setLeaderId] = useState(item?.exchangeLeaderId ?? "");
  const [values, setValues] = useState({
    exchangeName: item?.exchangeName ?? "",
    exchangeAddress: item?.exchangeAddress ?? "",
  });

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const queryClient = useQueryClient();

  let type = item?.id?.length > 0 ? "Edit" : "Add";
  const handleAddNewExchange = async (e) => {
    e.preventDefault();
    setLoading(true);

    await makeRequest
      .post(
        item?.id?.length > 0
          ? "/exchange/edit-exchange-info?exchangeId=" + item.id
          : "/manager/add-new-exchange",
        item?.id?.length > 0
          ? {
              exchangeAddress: values["exchangeAddress"],
              exchangeName: values["exchangeName"],
            }
          : {
              exchangeLeaderId: leaderId,
              exchangeAddress: values["exchangeAddress"],
              exchangeName: values["exchangeName"],
            },
        {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        }
      )
      .then((res) => {
        if (res.data.status === "Success") {
          setTimeout(() => {
            queryClient.invalidateQueries(["exchanges"]);
            successMessage(`${type} successful`);
            closeFormModal();
          }, 1000);
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

  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const prevPage = () => {
    page > 0 && setPage(page - 1);
  };

  const nextPage = () => {
    page + 1 < totalPage && setPage(page + 1);
  };

  const role = "LEADER_OF_COMMODITY_EXCHANGE";

  // get list users by role
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

  const [openListAssign, setOpenListAssign] = useState(false);

  return (
    <div class="form-exchange">
      {loading && <Loading />}
      <div className="form-exchange-container">
        <form className="form-exchange-form" onSubmit={handleAddNewExchange}>
          <div className="form-exchange-form-group">
            {type === "Add" && (
              <button
                className="form-exchange-assign"
                onClick={() => setOpenListAssign(true)}
                type="button"
              >
                Assign leader
              </button>
            )}
            {openListAssign && (
              <div className="form-exchange-list-leader">
                {isLoading ? (
                  <Loading />
                ) : error ? (
                  errorMessage("Something went wrong")
                ) : data.length <= 0 ? (
                  <p>Not have any leader exchange</p>
                ) : (
                  data.map((u, i) => (
                    <div
                      className="form-exchange-list-item"
                      key={i}
                      onClick={() => {
                        setLeaderId(u.userId);
                        setOpenListAssign(false);
                      }}
                    >
                      <p className="form-exchange-list-item-name">{u.name}</p>
                    </div>
                  ))
                )}

                {totalPage > 0 && (
                  <div class="pagination create-new-exchange">
                    <button
                      className="pagination-btn prev-btn create-new-exchange"
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
                  className="form-exchange-leader-close"
                  onClick={() => setOpenListAssign(false)}
                >
                  <AiOutlineClose />
                </div>
              </div>
            )}
            <input
              type="text"
              placeholder="Exchange leader id"
              className="form-exchange-input"
              name="exchangeLeaderId"
              value={leaderId}
              onChange={() => {}}
              required
            />
            {inputFilterExchange.map((item, index) => (
              <input
                className="form-exchange-input"
                type={item.type}
                placeholder={item.placeholder}
                name={item.name}
                value={values[item.name]}
                onChange={onChange}
                required
                key={index}
              />
            ))}
          </div>

          <button className="form-exchange-btn" type="submit">
            Submit
          </button>
        </form>
      </div>
      <AiOutlineClose
        className="form-exchange-close"
        onClick={closeFormModal}
      />
    </div>
  );
};

export default FormExchangeModal;
