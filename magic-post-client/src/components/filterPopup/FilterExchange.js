import "./filterPopup.css";
import { useContext, useState } from "react";
import makeRequest from "../../services/makeRequest";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../loading/loading";
import { AiOutlineClose } from "react-icons/ai";
import { inputFilterExchange } from "../../helpers/inputHelpers";

const FilterExchange = ({
  closeFilterExchange,
  getFilterExchange,
  setIsFiltering,
}) => {
  const { successMessage, errorMessage, currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    exchangeName: "",
    exchangeAddress: "",
  });

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleFilterExchange = async () => {
    setIsFiltering(true);
    setLoading(true);

    await makeRequest
      .post("/listing/get-list-exchange", values, {
        headers: { Authorization: `Bearer ${currentUser.accessToken}` },
      })
      .then((res) => {
        setTimeout(() => {
          getFilterExchange(res.data.data);
          successMessage("Filter successful");
          setLoading(false);
          closeFilterExchange();
        }, 500);
      })
      .catch((err) => {
        console.log(err);
        errorMessage("Something went wrong...");
        setLoading(false);
      });
  };

  return (
    <div class="filter-exchange">
      {loading && <Loading />}
      <div className="filter-exchange-container">
        <form className="filter-exchange-form">
          <h2 className="filter-exchange-title">Filter exchange</h2>
          <div className="filter-exchange-form-group">
            {inputFilterExchange.map((item, index) => (
              <input
                key={index}
                className="filter-exchange-input"
                type={item.type}
                placeholder={item.placeholder}
                name={item.name}
                value={values[item.name]}
                onChange={onChange}
                required
              />
            ))}
          </div>

          <button
            className="filter-exchange-btn"
            type="button"
            onClick={handleFilterExchange}
          >
            Filter
          </button>
        </form>
      </div>
      <AiOutlineClose
        className="filter-exchange-close"
        onClick={closeFilterExchange}
      />
    </div>
  );
};

export default FilterExchange;
