import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import LowerTaskView from "./LowerTaskView";
import { useDispatch, useSelector } from "react-redux";
import { deleteLead, getLeadById } from "../redux/leadReducer/leadSlice";

import ConfirmationModel from "./ConfirmationModal";
import { getAllLeads } from "../redux/leadReducer/leadSlice";

import BackArrow from "./BackArrow";
import LeadModal from "./LeadModal";

let headingName = "Delete Lead";
let bodyMessage = "Are you sure you want to delete this record?";
const LeadView = () => {
  // local state
  const { loggedInUser } = useSelector((state) => state.user.value);
  const [body, setBody] = useState({});
  const [isDisplay, setIsDisplay] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [titleName, setTitleName] = useState("Update Lead");

  // hooks
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { lead } = useSelector((state) => state.lead.value);

  // functions
  const handleEdit = () => {
    setShowModel(true);
  };

  const handleCancel = (data) => {
    setShowPopup(data);
    setShowModel(data);
  };

  const handleDelete = async () => {
    dispatch(deleteLead(id));
    dispatch(getAllLeads());
    navigate("/leads");
  };

  const handleShowModel = async () => {
    setShowPopup(true);
  };

  // life cycle hooks
  useEffect(() => {
    dispatch(getLeadById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (lead) setBody(lead);
  }, [lead]);

  return (
    <div>
      <ConfirmationModel
        showPopup={showPopup}
        handleCancel={handleCancel}
        handleDelete={handleDelete}
        headingName={headingName}
        bodyMessage={bodyMessage}
      />

      <LeadModal
        showModel={showModel}
        titleName={titleName}
        handleCancel={handleCancel}
        data={body}
        buttonName="Update"
      />

      {body && (
        <Container>
          <Row className="view-form">
            <Col></Col>
            <Col lg={8}>
              <Row className="view-form-header align-items-center">
                <Col lg={3}>
                  <i className="fa-solid fa-tablet-screen-button mx-1"></i> Lead
                  Details
                </Col>
                <Col lg={9} className="d-flex justify-content-end">
                  {loggedInUser.role === "ADMIN" ||
                    (loggedInUser.role === "SUPER_ADMIN" && (
                      <Button className="btn-sm mx-2" onClick={handleEdit}>
                        <i className="fa-regular fa-pen-to-square"></i>
                      </Button>
                    ))}

                  {loggedInUser.role === "ADMIN" ||
                    (loggedInUser.role === "SUPER_ADMIN" && (
                      <Button
                        className="btn-sm"
                        variant="danger"
                        onClick={handleShowModel}
                      >
                        Delete
                      </Button>
                    ))}
                </Col>
              </Row>
              <Col></Col>

              <Row className="view-form-data">
                <Col lg={6}>
                  <label>FirstName</label>
                  <span>{body.firstName}</span>
                </Col>
                <Col lg={6}>
                  <label>LastName</label>
                  <span>{body.lastName}</span>
                </Col>
                <Col lg={6}>
                  <label>Email</label>
                  <span>{body.email}</span>
                </Col>
                <Col lg={6}>
                  <label>Status</label>
                  <span>{body.status}</span>
                </Col>
                <Col lg={6}>
                  <label>Phone</label>
                  <span>{body.phone}</span>
                </Col>
                <Col lg={6}>
                  <label>Company</label>
                  <span>{body.company}</span>
                </Col>
                <Col lg={6}>
                  <label>Subject</label>
                  <span>{body?.subject}</span>
                </Col>
              </Row>
            </Col>
            <Col>
              <BackArrow />
            </Col>
          </Row>
        </Container>
      )}
      {(loggedInUser.role === "ADMIN" ||
        loggedInUser.role === "SUPER_ADMIN") && <LowerTaskView body={body} />}
    </div>
  );
};

export default LeadView;
