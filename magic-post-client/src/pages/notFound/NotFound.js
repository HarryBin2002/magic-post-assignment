import { Link } from "react-router-dom";
import "./notFound.scss";

const NotFound = () => {
  return (
    <div className="not-found">
      <h2 className="not-found-h2">Sorry, this page isn't available.</h2>
      <p className="not-found-text">
        The link you followed may be broken, or the page may have been removed.
        <Link to="/home" className="link">
          <span className="not-found-span">Go back to Magic Post.</span>
        </Link>
      </p>
    </div>
  );
};

export default NotFound;
