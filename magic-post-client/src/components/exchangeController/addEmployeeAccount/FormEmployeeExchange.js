import "./formEmployeeExchange.css";
import { useContext, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { AuthContext } from "../../../context/AuthContext";
import makeRequest from "../../../services/makeRequest";
import Loading from "../../loading/loading";
import { inputRegister } from "../../../helpers/inputHelpers";
import ViewUser from "../../viewPopup/ViewUser";
import { useQueryClient } from "@tanstack/react-query";

const FormEmployee = ({ closeFormModal, role }) => {
  const { successMessage, errorMessage, currentUser } =
    useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    name: "",
    email: "",
    nickName: "",
    age: "",
    address: "",
    phoneNumber: "",
    password: "",
    role: role,
  });

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const [isVisible, setIsVisible] = useState(false);
  const [infoEmployee, setInfoEmployee] = useState({});

  // close visible
  const closeVisible = () => setIsVisible(false);

  const queryClient = useQueryClient();

  const createNewEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);

    let route =
      role === "EMPLOYEE_OF_COMMODITY_EXCHANGE" ? "exchange" : "gathering";

    await makeRequest
      .post(`/${route}/add-employee-account`, values, {
        headers: { Authorization: `Bearer ${currentUser.accessToken}` },
      })
      .then((res) => {
        setTimeout(() => {
          queryClient.invalidateQueries(["employee-exchange-gathering"]);
          successMessage("Add successful");
          setLoading(false);
          closeFormModal();
          setInfoEmployee(values);
        }, 1000);
      })
      .catch((err) => {
        errorMessage("Something went wrong...");
        setLoading(false);
      });
  };

  return (
    <div class="form-modal-user">
      {loading && <Loading />}
      <div className="form-modal-user-container">
        <form className="form-modal-user-form" onSubmit={createNewEmployee}>
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
                <option className="form-modal-user-option" value={role}>
                  {role}
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

      {isVisible && (
        <ViewUser user={infoEmployee} closeVisible={closeVisible} />
      )}
    </div>
  );
};

export default FormEmployee;
