import "./formGatheringModal.css";
import { useContext, useState } from "react";
import makeRequest from "../../services/makeRequest";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../loading/loading";
import { AiOutlineClose } from "react-icons/ai";
import { inputFilterGatherings } from "../../helpers/inputHelpers";
import { useQueryClient } from "@tanstack/react-query";
import { GetLeaders } from "../../services/getReq";

const FormGatheringModal = ({ closeFormModal, item }) => {
  const { successMessage, errorMessage, currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [leaderId, setLeaderId] = useState(item?.gatheringLeaderId ?? "");
  const [values, setValues] = useState({
    gatheringName: item?.gatheringName ?? "",
    gatheringAddress: item?.gatheringAddress ?? "",
  });

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const queryClient = useQueryClient();
  let type = item?.id?.length > 0 ? "Edit" : "Add";

  const handleAddNewGathering = async (e) => {
    e.preventDefault();
    setLoading(true);

    await makeRequest
      .post(
        item?.id?.length > 0
          ? "/gathering/edit-gathering-info?gatheringId=" + item.id
          : "/manager/add-new-gathering",
        item?.id?.length > 0
          ? {
              gatheringAddress: values["gatheringAddress"],
              gatheringName: values["gatheringName"],
            }
          : {
              gatheringLeaderId: leaderId,
              gatheringAddress: values["gatheringAddress"],
              gatheringName: values["gatheringName"],
            },
        {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        }
      )
      .then((res) => {
        if (res.data.status === "Success") {
          setTimeout(() => {
            queryClient.invalidateQueries(["gatherings"]);
            successMessage(`${type} successful`);
            closeFormModal();
          }, 1000);
        } else if (res.data.message === "LEADER_OF_COMMODITY_GATHERING_USED") {
          errorMessage("Leader of commodity used.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        errorMessage("Something went wrong...");
        setLoading(false);
      });
  };

  // get list users by role
  const {
    isLoading,
    data: leaderGathering,
    error,
  } = GetLeaders("users", "LEADER_OF_COMMODITY_GATHERING");

  const [openListAssign, setOpenListAssign] = useState(false);

  return (
    <div class="form-gathering">
      {loading && <Loading />}
      <div className="form-gathering-container">
        <form className="form-gathering-form" onSubmit={handleAddNewGathering}>
          <div className="form-gathering-form-group">
            {type === "Add" && (
              <button
                className="form-gathering-assign"
                onClick={() => setOpenListAssign(true)}
                type="button"
              >
                Assign leader
              </button>
            )}
            {openListAssign && (
              <div className="form-gathering-list-leader">
                {isLoading ? (
                  <Loading />
                ) : error ? (
                  errorMessage("Something went wrong")
                ) : leaderGathering.length === 0 ? (
                  <p>Not have any leader gathering</p>
                ) : (
                  leaderGathering.map((u, i) => (
                    <div
                      className="form-gathering-list-item"
                      key={i}
                      onClick={() => {
                        setLeaderId(u.userId);
                        setOpenListAssign(false);
                      }}
                    >
                      <p className="form-gathering-list-item-name">{u.name}</p>
                    </div>
                  ))
                )}

                <div
                  className="form-gathering-leader-close"
                  onClick={() => setOpenListAssign(false)}
                >
                  <AiOutlineClose />
                </div>
              </div>
            )}
            <input
              type="text"
              placeholder="Gathering leader id"
              className="form-gathering-input"
              name="gatheringLeaderId"
              value={leaderId}
              // onChange={onChange}
              required
            />
            {inputFilterGatherings.map((item, index) => (
              <input
                className="form-gathering-input"
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

          <button className="form-gathering-btn" type="submit">
            Submit
          </button>
        </form>
      </div>
      <AiOutlineClose
        className="form-gathering-close"
        onClick={closeFormModal}
      />
    </div>
  );
};

export default FormGatheringModal;
