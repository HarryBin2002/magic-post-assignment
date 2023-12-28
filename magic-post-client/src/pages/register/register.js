import "./register.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import makeRequest from "../../services/makeRequest";
import Loading from "../../components/loading/loading";
import { inputRegister } from "../../helpers/inputHelpers";

const Register = () => {
  const { successMessage, errorMessage } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    email: "",
    nickName: "",
    age: "",
    address: "",
    phoneNumber: "",
    password: "",
    role: "USER_NORMAL",
  });

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { age, ...others } = values;
    let convertAgeToInt = parseInt(age);
    const data = { age: convertAgeToInt, ...others };

    await makeRequest
      .post("/user/register", data)
      .then((res) => {
        setTimeout(() => {
          successMessage("Register successfully");
          setLoading(false);
          navigate("/login");
        });
      })
      .catch((err) => {
        console.log(err);
        errorMessage("Something went wrong...");
        setLoading(false);
      });
  };

  return (
    <div class="register">
      <div className="register-intro-header">
        <Link to="/" className="link">
          <img
            className="register-intro-header-logo"
            src="https://res.cloudinary.com/djqxdscwh/image/upload/v1699885216/main-logo-white-transparent_o4yzqi.png"
            alt=""
          />
        </Link>
        <div className="register-intro-header-btn">
          <Link to="/login" className="link">
            <button className="register-intro-login">Login</button>
          </Link>
          <Link to="/register" className="link">
            <button className="register-intro-register">Register</button>
          </Link>
        </div>
      </div>
      {loading && <Loading />}
      <form className="register-form" onSubmit={handleRegister}>
        <h3 className="register-title">Register</h3>

        <div className="register-form-group">
          <div className="register-group">
            {inputRegister.slice(0, 4).map((item, index) => (
              <input
                key={index}
                className="register-input"
                type={item.type}
                placeholder={item.placeholder}
                name={item.name}
                value={values[item.name]}
                onChange={onChange}
                max={item.max ?? null}
                min={item.min ?? null}
                required
              />
            ))}
          </div>

          <div className="register-group">
            {inputRegister.slice(4, inputRegister.length).map((item, index) => (
              <input
                key={index}
                className="register-input"
                type={item.type}
                placeholder={item.placeholder}
                name={item.name}
                value={values[item.name]}
                onChange={onChange}
                required
              />
            ))}

            <select className="register-select" onChange={onChange} name="role">
              <option className="register-option" value="USER_NORMAL">
                USER_NORMAL
              </option>
              <option className="register-option" value="MANAGER">
                MANAGER
              </option>
              <option
                className="register-option"
                value="LEADER_OF_COMMODITY_EXCHANGE"
              >
                LEADER_OF_COMMODITY_EXCHANGE
              </option>
              <option
                className="register-option"
                value="EMPLOYEE_OF_COMMODITY_EXCHANGE"
              >
                EMPLOYEE_OF_COMMODITY_EXCHANGE
              </option>
              <option
                className="register-option"
                value="LEADER_OF_COMMODITY_GATHERING"
              >
                LEADER_OF_COMMODITY_GATHERING
              </option>
              <option
                className="register-option"
                value="EMPLOYEE_OF_COMMODITY_GATHERING"
              >
                EMPLOYEE_OF_COMMODITY_GATHERING
              </option>
            </select>
          </div>
        </div>

        <button className="register-btn" type="submit">
          Register
        </button>
        <div className="register-footer">
          <p>Do you have an account ?</p>
          <Link to="/login" className="link">
            <p className="register-btn-login">Login</p>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
