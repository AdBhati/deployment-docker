import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { Error, Success } from "../utils/toastStyles";
import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import IMAGES from "../assets/images";
import { useDispatch, useSelector } from "react-redux";
import {
  compareOldAndNewPasswords,
  logout,
  resetError,
  resetPassword,
} from "../redux/userReducer/userSlice";
import ConfirmationModel from "./ConfirmationModal";

let headingName = "Update Password";

let bodyMessage = "";

const Profile = () => {
  const [oldPasswordFill, setOldPasswordFill] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const [userData, setUserData] = useState({
    userId: "",
    salutation: "",
    name: "",
    email: "",
    gender: "",
    role: "",
  });

  const location = useLocation();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loggedInUser, error } = useSelector((state) => state.user.value);

  const handleShowModel = async () => {
    if (!password || !retypePassword || password !== retypePassword) {
      toast.error("Password doesn't Match", Error);
      return;
    }
    setShowPopup(true);
  };

  const handleCancel = (data) => {
    setShowPopup(data);
  };

  const handleUpdate = async () => {
    dispatch(
      resetPassword({
        id: userData?.userId,
        oldPasswordFill,
        password,
      })
    );

    if (!location?.state?.row) {
      dispatch(logout());
      navigate("/login");
    } else {
      setPassword("");
      setRetypePassword("");
      toast.success("Password updated successfully!!", {
        style: Success,
      });
    }
  };

  useEffect(() => {
    if (location?.state?.row) {
      bodyMessage = "Do you want to change password.";
    } else {
      bodyMessage = "You will be logout after resetting your password.";
    }
  }, [location?.state?.row]);

  const oldPasswordHandler = (e) => {
    setOldPassword(e.target.value);
  };

  useEffect(() => {
    if (location?.state) {
      setUserData({
        userId: location.state.row._id,
        name: location.state.row.firstName,
        email: location.state.row.email,
        gender: location.state.row.gender,
      });
    } else {
      const jwt = sessionStorage.getItem("jwt");
      const { userId, name, email, gender, role } = jwtDecode(jwt);
      setUserData({ userId, name, email, gender, role });
    }
  }, [location?.state]);

  useEffect(() => {
    if (error && error === "Incorrect old password") {
      setOldPasswordFill("");
      toast.error(error, Error);
      setOldPassword("");
      dispatch(resetError());
    }

    if (oldPassword) {
      dispatch(
        compareOldAndNewPasswords({
          id: userData?.userId,
          oldPassword,
        })
      );
      setOldPassword("");
    }
  }, [dispatch, error, oldPassword, userData?.userId]);

  return (
    <>
      <div>
        <ConfirmationModel
          showPopup={showPopup}
          handleCancel={handleCancel}
          headingName={headingName}
          bodyMessage={bodyMessage}
          handleUpdate={handleUpdate}
        />
        <div className="container bootstrap snippets bootdey">
          <div className="row">
            <div className="col-md-2">
              <div className="text-center">
                <img
                  src={
                    userData.gender === "Female" ||
                    ["Ms.", "Mrs"].includes(userData.salutation)
                      ? IMAGES.female
                      : IMAGES.male
                  }
                  className="avatar img-circle img-thumbnail"
                  alt="avatar"
                />
              </div>
            </div>

            <div className="col-md-9 personal-info view-form-data">
              <div>
                <h3>
                  {location?.state ? userData.userName : ""} Personal info
                </h3>
              </div>

              <form className="form-horizontal">
                <div className="form-group">
                  <label className="col-lg-3 control-label">Name</label>
                  <div className="col-lg-8">
                    <input
                      className="form-control"
                      type="text"
                      value={userData?.name}
                      disabled
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-lg-3 control-label">Email</label>
                  <div className="col-lg-8">
                    <input
                      className="form-control"
                      type="text"
                      value={userData?.email}
                      disabled
                    />
                  </div>
                </div>
                <h5 className="my-2">Edit Password</h5>
                {location?.state?.row ? (
                  ""
                ) : (
                  <div className="form-group">
                    <label className="col-lg-3 control-label">
                      Old Password
                    </label>
                    <div className="col-lg-8">
                      <input
                        className="form-control date"
                        name="oldPassword"
                        type="password"
                        value={oldPasswordFill}
                        placeholder="Enter Your Old Password"
                        onBlur={(e) => oldPasswordHandler(e)}
                        onChange={(e) => setOldPasswordFill(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}
                <div className="form-group">
                  <label className="col-lg-3 control-label">New Password</label>
                  <div className="col-lg-8">
                    <input
                      className="form-control date"
                      type="password"
                      name="password"
                      value={password}
                      placeholder="Enter New Password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="col-lg-3 control-label">
                    Retype New Password
                  </label>
                  <div className="col-lg-8">
                    <input
                      className="form-control date"
                      type="password"
                      name="retypePassword"
                      value={retypePassword}
                      placeholder="Retype New Password"
                      onChange={(e) => setRetypePassword(e.target.value)}
                    />
                  </div>
                  <Button
                    className="btn-sm mx-2 my-2"
                    onClick={handleShowModel}
                    disabled={
                      loggedInUser?.role !== "USER" &&
                      location?.state &&
                      password &&
                      retypePassword
                        ? false
                        : !location?.state &&
                          password &&
                          retypePassword &&
                          oldPasswordFill
                        ? false
                        : true
                    }
                  >
                    Update Password
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
