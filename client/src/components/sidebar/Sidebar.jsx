import { Link, useLocation } from "react-router-dom";
import IMAGES from "../../assets/images";
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { setLoggedInUser } from "../../redux/userReducer/userSlice";
import { useDispatch, useSelector } from "react-redux";

const Sidebar = ({ className }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  const location = useLocation();
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.user.value.loggedInUser);

  useEffect(() => {
    if (role && ["ADMIN", "SUPER_ADMIN"].includes(role)) {
      setIsAdmin(true);
    }
  }, [role]);

  useEffect(() => {
    if (sessionStorage.getItem("jwt")) {
      const decoded = jwtDecode(sessionStorage.getItem("jwt"));
      dispatch(setLoggedInUser(decoded));
    }
  }, [dispatch]);

  if (location.pathname === "/login") return <></>;

  return (
    <>
      <nav id="sidebar" className={`${className}`}>
        <div
          className="sidebar-header text-center"
          style={{ paddingLeft: "10px", paddingRight: "10px" }}
        >
          <img
            src={IMAGES.batwaraLogoWhite}
            style={{ width: "150px" }}
            alt=""
          />
          {/* <h5>BATWARA ASSOCIATES</h5> */}
        </div>

        <ul
          className="list-unstyled components d-flex flex-column"
          style={{ borderTop: "1px solid #ccc" }}
        >
          <li className={`${location.pathname === "/" ? "active" : ""} h5`}>
            <Link to="/">
              <i className="fa-solid fa-house mx-2"></i>Home
            </Link>
          </li>

          {isAdmin ? (
            <li
              className={`${location.pathname === "/leads" ? "active" : ""} h5`}
            >
              <Link to="/leads">
                <i class="fa-solid fa-bolt mx-2"></i> Leads
              </Link>
            </li>
          ) : (
            ""
          )}

          <li
            className={`${location.pathname === "/cases" ? "active" : ""} h5`}
          >
            <Link to="/cases">
              <i className="fa-regular fas fa-tasks mx-2"></i>Cases
            </Link>
          </li>
          <li
            className={`${location.pathname === "/profile" ? "active" : ""} h5`}
          >
            <Link to="/profile">
              <i className="fa fa-user mx-2"></i> Profile
            </Link>
          </li>
          {isAdmin ? (
            <>
              <li
                className={`${
                  location.pathname === "/users" ? "active" : ""
                } h5`}
              >
                <Link to="/users">
                  <i className="fa-solid fa-user-group mx-2"></i>Users
                </Link>
              </li>
              <li
                className={`${
                  location.pathname === "/reports" ? "active" : ""
                } h5`}
              >
                <Link to="/reports">
                  <i className="fa fa-download mx-2"></i> Reports
                </Link>
              </li>
            </>
          ) : (
            ""
          )}
        </ul>
        <li className="d-flex align-items-center justify-content-center">
          <img
            style={{ width: "150px", position: "fixed", bottom: "1rem" }}
            src={IMAGES.indicrm_white}
            alt=""
          />
        </li>
      </nav>
    </>
  );
};

export default Sidebar;
