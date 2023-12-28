import { useNavigate } from "react-router-dom";

const UnAuthorized = ({ setIsPage401 }) => {
  const navigate = useNavigate();
  const handlePage401 = () => {
    setIsPage401(false);
    navigate("/login");
    setTimeout(() => {
      window.location.reload();
    }, 200);
  };

  return (
    <div className="authorized-page">
      <div className="authorized-page-container">
        <h2 className="authorized-page-title">Sorry, something went wrong</h2>
        <p className="authorized-page-text">
          Please try close browser and login again.
        </p>
        <button className="authorized-page-btn" onClick={handlePage401}>
          Ok
        </button>
      </div>
    </div>
  );
};

export default UnAuthorized;
