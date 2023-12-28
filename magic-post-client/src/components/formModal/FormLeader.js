import "./formUser.css";
import { useContext, useState } from "react";
import makeRequest from "../../services/makeRequest";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../loading/loading";
import { AiOutlineClose } from "react-icons/ai";
import { inputRegister } from "../../helpers/inputHelpers";
import { useQueryClient } from "@tanstack/react-query";

const FormLeader = ({ closeFormModal }) => {
  const { successMessage, errorMessage, currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    name: "",
    email: "",
    nickName: "",
    age: "",
    address: "",
    phoneNumber: "",
    password: "",
    role: "LEADER_OF_COMMODITY_EXCHANGE",
  });

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const queryClient = useQueryClient();

  const handleCreateLeader = async (e) => {
    e.preventDefault();
    setLoading(true);

    await makeRequest
      .post("/user/register", values, {
        headers: { Authorization: `Bearer ${currentUser.accessToken}` },
      })
      .then((res) => {
        setTimeout(() => {
          queryClient.invalidateQueries(["leaders"]);
          successMessage("Add leader successfully");
          setLoading(false);
          closeFormModal();
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        errorMessage("Something went wrong...");
        setLoading(false);
      });
  };

  return (
    <div class="form-modal-user">
      {loading && <Loading />}
      <div className="form-modal-user-container">
        <form className="form-modal-user-form" onSubmit={handleCreateLeader}>
          <div className="form-modal-user-form-group">
            <div className="form-modal-user-child">
              {inputRegister.slice(0, 4).map((item, index) => (
                <input
                  className="form-modal-user-input"
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
            <div className="form-modal-user-child">
              {inputRegister
                .slice(4, inputRegister.length)
                .map((item, index) => (
                  <input
                    className="form-modal-user-input"
                    type={item.type}
                    placeholder={item.placeholder}
                    name={item.name}
                    value={values[item.name]}
                    onChange={onChange}
                    required
                    key={index}
                  />
                ))}
              <select
                className="form-modal-user-select"
                onChange={onChange}
                name="role"
              >
                <option
                  className="form-modal-user-option"
                  value="LEADER_OF_COMMODITY_EXCHANGE"
                >
                  LEADER_OF_COMMODITY_EXCHANGE
                </option>

                <option
                  className="form-modal-user-option"
                  value="LEADER_OF_COMMODITY_GATHERING"
                >
                  LEADER_OF_COMMODITY_GATHERING
                </option>
              </select>
            </div>
          </div>

          <button className="form-modal-user-btn" type="submit">
            Submit
          </button>
        </form>
      </div>
      <AiOutlineClose
        className="form-modal-user-close"
        onClick={closeFormModal}
      />
    </div>
  );
};

export default FormLeader;
