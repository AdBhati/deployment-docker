import React, { useEffect, useState } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";

import Form from "react-bootstrap/Form";
import {
  createNewTask,
  getTasksByLeadId,
  isPopup,
  resetError,
  updateTask,
} from "../redux/taskReducer/taskSlice";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../redux/userReducer/userSlice";
import { toast } from "react-hot-toast";
import { emailTypeEnum, priorityEnum, taskEnum } from "../utils/constants";
import { validateEmail } from "../utils";
import { useParams } from "react-router-dom";
import { getLeadByIdRemarks } from "../redux/leadReducer/leadSlice";

const TaskModal = ({ buttonName, data, title }) => {
  // hooks
  const { loggedInUser } = useSelector((state) => state.user.value);
  const { lead } = useSelector((state) => state.lead.value);
  const { users } = useSelector((state) => state.user.value);
  const { openPopup, task } = useSelector((state) => state.task.value);
  const { error, message } = useSelector((state) => state.task.value);
  const dispatch = useDispatch();
  const { id } = useParams();

  const [closePopup, setClosePopup] = useState(false);

  // local state
  const [isInvoiceVisible, setIsInvoiceVisible] = useState(false);
  const [taskRecords, setTaskRecords] = useState({
    title: "",
    priority: "",
    type: "",
    body: "",
    description: "",
    email: "",
    leadId: id ? id : "",
    status: "",
    ownerId: "",
    invoiceNumber: null,
    remarks: "",
    isCompleted: false,
  });

  // functions
  const handleChange = (e) => {
    setTaskRecords({ ...taskRecords, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (e) => {
    setTaskRecords({ ...taskRecords, isCompleted: e.target.checked });
  };

  const handleSave = async () => {
    try {
      if (isInvoiceVisible && !taskRecords.invoiceNumber) {
        throw new Error("Please enter the invoice number.");
      }
      if (!validateEmail(taskRecords.email)) {
        toast.error("Invalid email address", Error);
        return;
      }

      if (buttonName === "Update") {
        dispatch(updateTask(taskRecords));
        dispatch(isPopup(false));
      } else {
        if (
          !taskRecords.title ||
          !taskRecords.status ||
          !taskRecords.priority ||
          !taskRecords.type ||
          !taskRecords.ownerId ||
          !taskRecords.body
        ) {
          throw new Error("Please fill all required fields.");
        }

        dispatch(createNewTask(taskRecords));
        dispatch(getTasksByLeadId(lead._id));
        dispatch(getLeadByIdRemarks(id));
        dispatch(isPopup(false));
        setTaskRecords({
          title: "",
          priority: "",
          type: "",
          body: "",
          description: "",
          email: "",
          leadId: id ? id : "",
          status: "",
          ownerId: "",
          invoiceNumber: null,
          remarks: "",
          isCompleted: false,
        });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAssign = (e) => {
    const selectedOwnerId = e.target.value;
    setTaskRecords({ ...taskRecords, ownerId: selectedOwnerId });
  };

  // life cycle hooks
  useEffect(() => {
    if (buttonName === "Update") {
      setTaskRecords(data);
    }
  }, [buttonName, data]);

  useEffect(() => {
    if (taskRecords && taskRecords.status === "Closed") {
      setIsInvoiceVisible(true);
    } else {
      setIsInvoiceVisible(false);
    }
  }, [taskRecords]);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, Error);

      if (task) {
        dispatch(isPopup(true));
      }
      dispatch(resetError());
    } else {
      // dispatch(isPopup(false));
      dispatch(resetError());
    }
  }, [error, dispatch, task]);
  return (
    <Modal show={openPopup}>
      <Modal.Header
        closeButton
        onClick={() => {
          dispatch(isPopup(false));
          dispatch(resetError());
        }}
      >
        <Modal.Title>{title} </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container className="view-form">
          <Form className="mt-3">
            <Row>
              <Col>
                <Form.Group className="mx-3">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicTitle"
                  >
                    Title<sup className="sup">*</sup>
                  </Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="title"
                    placeholder="Enter Title"
                    value={taskRecords.title}
                    onChange={(e) => handleChange(e)}
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className="mx-3">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicEmail"
                  >
                    Email<sup className="sup">*</sup>
                  </Form.Label>
                  <Form.Control
                    required
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    value={taskRecords.email}
                    onChange={(e) => handleChange(e)}
                  />
                </Form.Group>
              </Col>
              <Row>
                <Col sm={6}>
                  <Form.Group className="mx-3">
                    {" "}
                    <Form.Label className="form-view-label" htmlFor="priority">
                      Priority<sup className="sup">*</sup>
                    </Form.Label>
                    <Form.Select
                      aria-label="Select priority"
                      name="priority"
                      required
                      value={taskRecords.priority}
                      onChange={(e) => handleChange(e)}
                      disabled={loggedInUser.role === "USER" ? true : false}
                    >
                      <option value="">--Select--</option>
                      {priorityEnum.map((en, index) => (
                        <option value={en} key={index}>
                          {en}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col sm={6}>
                  <Form.Group className="mx-3">
                    <Form.Label className="form-view-label" htmlFor="status">
                      Status<sup className="sup">*</sup>
                    </Form.Label>
                    <Form.Select
                      aria-label="Select Status"
                      name="status"
                      required
                      value={taskRecords.status}
                      onChange={(e) => handleChange(e)}
                    >
                      <option value="">--Select--</option>
                      {taskEnum.map((en, index) => (
                        <option value={en} key={index}>
                          {en}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group className="mx-3">
                    <Form.Label
                      className="form-view-label"
                      htmlFor="formBasicBody"
                    >
                      Body<sup className="sup">*</sup>
                    </Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name="body"
                      placeholder="Enter Body"
                      value={taskRecords.body}
                      onChange={(e) => handleChange(e)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Col>
                <Form.Group className="mx-3">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicdescription"
                  >
                    Description<sup className="sup">*</sup>
                  </Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="description"
                    placeholder="Enter description"
                    value={taskRecords.description}
                    onChange={(e) => handleChange(e)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col sm={6}>
                <Form.Group className="mx-3">
                  <Form.Label className="form-view-label" htmlFor="type">
                    Type<sup className="sup">*</sup>
                  </Form.Label>
                  <Form.Select
                    aria-label="Select Type"
                    name="type"
                    required
                    value={taskRecords.type}
                    onChange={(e) => handleChange(e)}
                  >
                    <option value="">--Select--</option>
                    {emailTypeEnum.map((en, index) => (
                      <option value={en} key={index}>
                        {en}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col lg={6}>
                <Form.Group className="mx-3">
                  <Form.Label className="form-view-label" htmlFor="ownerId">
                    Assign Owner<sup className="sup">*</sup>
                  </Form.Label>
                  <Form.Select
                    aria-label="SELECT OWNER"
                    name="ownerId"
                    required
                    value={taskRecords.ownerId}
                    onChange={(e) => handleAssign(e)}
                  >
                    <option value="">-- Select Owner --</option>
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.firstName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Row>
                <Col>
                  <Form.Group className="mx-3">
                    <Form.Label className="form-view-label">Remarks</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name="remarks"
                      placeholder="Enter Remark"
                      value={taskRecords.remarks}
                      onChange={(e) => handleChange(e)}
                    />
                  </Form.Group>
                </Col>
                {buttonName === "Update" ? (
                  <Col>
                    <Form.Group className="mx-3">
                      <Form.Label className="form-view-label">
                        Completed
                      </Form.Label>
                      <input
                        style={{
                          marginTop: "8px",
                          marginLeft: "10px",
                          width: "20px",
                          height: "20px",
                        }}
                        required
                        type="checkbox"
                        name="isCompleted"
                        checked={taskRecords.isCompleted}
                        value={taskRecords.isCompleted}
                        onChange={(e) => handleCheckbox(e)}
                        disabled={!taskRecords.remarks}
                      />
                    </Form.Group>
                  </Col>
                ) : (
                  " "
                )}
              </Row>

              {isInvoiceVisible && (
                <Col>
                  <Form.Group className="mx-3">
                    <Form.Label
                      className="form-view-label"
                      htmlFor="invoiceNumber"
                    >
                      Invoice Number<sup className="sup">*</sup>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="invoiceNumber"
                      placeholder="Enter Invoice Number"
                      value={taskRecords.invoiceNumber}
                      onChange={(e) => handleChange(e)}
                    />
                  </Form.Group>
                </Col>
              )}
            </Row>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="danger"
          onClick={() => {
            dispatch(isPopup(false));
            dispatch(resetError());
          }}
        >
          Close
        </Button>

        <Button variant="dark" onClick={() => handleSave()}>
          {buttonName}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TaskModal;
