import { Button } from "react-bootstrap";
import Logo from "../../assets/movie-mate-logo-2.png";

import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="d-flex flex-column gap-5 justify-content-center align-items-center">
      {" "}
      <img
        src={Logo}
        className="img-fluid pt-3 d-none d-md-block"
        alt="Movie Mate Logo"
        width="500px"
      />
      <Link to="/">
        <Button>Go to Home</Button>
      </Link>
    </div>
  );
};

export default Dashboard;
