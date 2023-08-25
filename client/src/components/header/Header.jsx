import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Error, Success } from "../../utils/toastStyles";
import { getDashboardData, logout } from "../../redux/userReducer/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { resetEmail, syncWithEmail } from "../../redux/emailReducer/emailSlice";
import "react-toastify/dist/ReactToastify.css";
const Header = ({ changeClassName }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const [sidebar, setSidebar] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.email.value);
  const { loggedInUser, error } = useSelector((state) => state.user.value);

  const toggleSidebar = () => {
    setSidebar(!sidebar);
    if (!sidebar) changeClassName("active");
    else changeClassName("");
  };

  const logoutUser = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleGmail = async () => {
    dispatch(syncWithEmail());
    setIsDisable(true);
  };

  useEffect(() => {
    if (loggedInUser) {
      setName(loggedInUser.name);
      setRole(loggedInUser.role);
    }
    if (error && error === "jwt expired") {
      toast.error("Session expired. Please logout and login again", Error);
      sessionStorage.removeItem("jwt");
    }
  }, [error, loggedInUser]);

  useEffect(() => {
    if (data) {
      const dataArray = data.split(",");
      const assigned = dataArray[0] || "";
      const unassigned = dataArray.slice(1).join(",");
      toast.success(
        <div>
          <p style={{ fontSize: "14px", fontWeight: "bold", marginTop: "0" }}>
            {assigned}
          </p>
          <p
            style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "0" }}
          >
            {unassigned}
          </p>
        </div>
      );
      dispatch(getDashboardData());
    }
    setIsDisable(false);

    dispatch(resetEmail());
  }, [data, dispatch]);

  if (location.pathname === "/login") return <></>;
  return (
    <>
      <Navbar className="header px-2" bg="" expand="lg" variant="">
        <button
          type="button"
          id="sidebarCollapse"
          className="btn btn-info"
          onClick={() => toggleSidebar()}
        >
          <i className="fas fa-align-left"></i>
        </button>
        <Navbar.Brand href="#home"></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#">Logged in </Nav.Link>
            <Nav.Link href="#">
              <Link
                to={"/profile"}
                style={{
                  backgroundColor: "#eef2f9",
                  borderRadius: "3px",
                  padding: "2px",
                  textDecoration: "none",
                  textTransform: "capitalize",
                }}
              >
                {name.split(" ")[0]}
                {/* {name} */}
              </Link>
              &nbsp; as
            </Nav.Link>
            <Nav.Link href="#">
              <Link
                style={{
                  backgroundColor: "#eef2f9",
                  padding: "3px",
                  fontSize: "10px",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  textDecoration: "none",
                }}
              >
                {role}
              </Link>
            </Nav.Link>
            <Nav.Link href="#">{}</Nav.Link>
          </Nav>

          <Nav className="ml-auto">
            <Button
              variant="btn btn-primary"
              onClick={handleGmail}
              title="syncwithgmail"
              disabled={isDisable}
            >
              Sync With Gmail
            </Button>

            <Nav.Link href="/about"></Nav.Link>
            {sessionStorage.getItem("jwt") ? (
              <Button
                variant="btn btn-primary"
                onClick={logoutUser}
                title="Logout"
              >
                <i className="fa-solid fa-right-from-bracket"></i>
              </Button>
            ) : (
              <></>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default Header;
