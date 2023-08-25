import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import {
  getTaskById,
  isPopup,
  resetError,
} from "../redux/taskReducer/taskSlice";
import { useDispatch, useSelector } from "react-redux";
import TaskModal from "./TaskModal";
import BackArrow from "./BackArrow";

const TaskView = () => {
  const dispatch = useDispatch();
  const { task, error } = useSelector((state) => state.task.value);

  const [buttonName, setButtonName] = useState("");

  const { id } = useParams();

  const handleEdit = () => {
    setButtonName("Update");
    dispatch(isPopup(true));
  };

  useEffect(() => {
    dispatch(getTaskById(id));
  }, [dispatch, id]);

  return (
    <div>
      <TaskModal data={task} buttonName={buttonName} title="Update Case" />
      {task && (
        <Container>
          <Row className="view-form">
            <Col></Col>
            <Col lg={8}>
              <Row className="view-form-header align-items-center">
                <Col lg={3}>
                  <i className="fa-regular fas fa-tasks mx-2"></i> Case Details
                </Col>
                <Col lg={9} className="d-flex justify-content-end">
                  {task.status === "Closed" ? (
                    <Button
                      className="btn-sm mx-2"
                      onClick={() => handleEdit()}
                      disabled
                    >
                      <i className="fa-regular fa-pen-to-square"></i>
                    </Button>
                  ) : (
                    <Button
                      className="btn-sm mx-2"
                      onClick={() => handleEdit()}
                    >
                      <i className="fa-regular fa-pen-to-square"></i>
                    </Button>
                  )}
                  <Button className="btn-sm" variant="danger" disabled>
                    Delete
                  </Button>
                </Col>
              </Row>
              <Row className="view-form-data">
                <Col lg={6}>
                  <label>Title</label>
                  <span>{task.title}</span>
                </Col>
                <Col lg={6}>
                  <label>Email</label>
                  <span>{task.email}</span>
                </Col>

                <Col lg={6}>
                  <label>Priority</label>
                  <span>{task.priority}</span>
                </Col>
                <Col lg={6}>
                  <label>Status</label>
                  <span>{task.status}</span>
                </Col>
                <Col lg={12}>
                  <label>Description</label>
                  <span>{task.description}</span>
                </Col>
                <Col lg={12}>
                  <label>Body</label>
                  <span>{task.body}</span>
                </Col>
                <Col lg={12}>
                  <label>Remark</label>
                  <span>{task.remarks}</span>
                </Col>

                {task.status === "Closed" && (
                  <Col lg={6}>
                    <label>Invoice Number</label>
                    <span>{task.invoiceNumber}</span>
                  </Col>
                )}
              </Row>
            </Col>
            <Col lg={2}>
              <BackArrow />
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
};

export default TaskView;
