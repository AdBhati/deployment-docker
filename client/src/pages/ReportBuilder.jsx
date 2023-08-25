import React, { useState, useEffect } from "react";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { Button, Col, Form, Row, Container } from "react-bootstrap";
import {showLeadBackup,showTaskBackup} from "../redux/reportReducer/reportSlice";
import { useDispatch, useSelector } from "react-redux";
import LeadReportData from "../components/LeadReportData";
import TaskReportData from "../components/TaskReportData";
import { toast } from "react-hot-toast";
import { leadEnum, taskEnum } from "../utils/constants";
import { Link, useLocation } from "react-router-dom";
import { getPath } from "../utils";

const ReportBuilder = () => {

  const [showReportData, setShowReportData] = useState([]);
  const [isShowReport, setIsShowReport] = useState(false);
  const [reportData, setReportData] = useState({
    tableName: "",
    duration: "",
    startDate: "",
    endDate: "",
    status: "",
  });
  const location = useLocation();
  
  const dispatch = useDispatch();
  const { report} = useSelector((state) => state.report.value);
  
  const handleChange = (e) => {
    setReportData({ ...reportData, [e.target.name]: e.target.value });
    setIsShowReport(false);
  };

  const showReport = () => {
    const dateString = new Date().toString();
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-GB");
    const parts = formattedDate.split("/");
    const formattedTodayDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    if (reportData.startDate > reportData.endDate) {
      toast.error("End date should be greater than start date");
      setReportData({
        tableName: "",
        duration: "",
        startDate: "",
        endDate: "",
        status: "",
      });
      return;
    }
  
    if (
      (reportData.startDate && !reportData.endDate) ||
      (!reportData.startDate && reportData.endDate)
    ) {
      toast.error("Please fill both date fields!!");
      return;
    }
  
    if (reportData.endDate > formattedTodayDate) {
      toast.error("End date cannot be greater than today!!");
      setReportData({
        tableName: "",
        duration: "",
        startDate: "",
        endDate: "",
        status: "",
      });
      return;
    }
    if (reportData.tableName === "lead") {
      dispatch(showLeadBackup(reportData))
        .then((action) => {
          const data = action.payload;
          if (data.error) {
            setIsShowReport(false);
            toast.error(data.error);
            setReportData({
              tableName: "",
              duration: "",
              startDate: "",
              endDate: "",
              status: "",
            });
          }
        })
        .catch((error) => {
          console.error("Error in showLeadBackup:", error);
          setIsShowReport(false);
          toast.error("An error occurred while fetching lead data.");
          setReportData({
            tableName: "",
            duration: "",
            startDate: "",
            endDate: "",
            status: "",
          });
        });
    } else if (reportData.tableName === "task") {
      dispatch(showTaskBackup(reportData))
        .then((actionTask) => {
          const data = actionTask.payload;
          if (data.error) {
            setIsShowReport(false);
            toast.error(data.error);
            setReportData({
              tableName: "",
              duration: "",
              startDate: "",
              endDate: "",
              status: "",
            });
          }
        })
        .catch((error) => {
          console.error("Error in showTaskBackup:", error);
          setIsShowReport(false);
          toast.error("An error occurred while fetching task data.");
          setReportData({
            tableName: "",
            duration: "",
            startDate: "",
            endDate: "",
            status: "",
          });
        });
    }
  };
  
  useEffect(() => {
    if (report && report.data) {
      setShowReportData(report.data);
      setIsShowReport(true);
    } else {
      setIsShowReport(false);
    }
  }, [report]);

  return (
    <div>
      <Row>
        <Col lg={2} className="mx-2">
          <Link className="nav-link" to="/">
            Home <i className="fa-solid fa-chevron-right"></i>{" "}
            {getPath(location.pathname)}
          </Link>
        </Col>
        <Container className="view-form">
          <Col lg={12}>
            <Form className="mt-3" noValidate>
              <Row>
                <Col lg={8}>
                  <h3 style={{ marginLeft: "10px" }}>Create Report</h3>
                </Col>
              </Row>

              <Row>
                <Col lg={2}>
                  <Form.Group className="mx-3">
                    <Form.Label className="form-view-label" htmlFor="tableName">
                      Table
                    </Form.Label>
                    <Form.Select
                      aria-label="select table name"
                      name="tableName"
                      value={reportData.tableName}
                      onChange={handleChange}
                    >
                      <option value="">--Select-Table--</option>
                      <option value="lead">Lead</option>
                      <option value="task">Case</option>
                    </Form.Select>

                    <Form.Control.Feedback type="invalid">
                      Enter Report.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col lg={2}>
                  {reportData.tableName === "lead" ? (
                    <Form.Group className=" mt-3">
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicFees"
                      >
                        Status
                      </Form.Label>
                      <Form.Select
                        aria-label="Select duration"
                        name="status"
                        value={reportData.status}
                        onChange={handleChange}
                      >
                        <option value={leadEnum[0]}>{leadEnum[0]}</option>
                        <option value={leadEnum[1]}>{leadEnum[1]}</option>
                        <option value={leadEnum[2]}>{leadEnum[2]}</option>
                      </Form.Select>
                    </Form.Group>
                  ) : (
                    <Form.Group className=" mt-3">
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicFees"
                      >
                        Status
                      </Form.Label>
                      <Form.Select
                        aria-label="Select duration"
                        name="status"
                        value={reportData.status}
                        onChange={handleChange}
                      >
                        <option value={taskEnum[0]}>{taskEnum[0]}</option>
                        <option value={taskEnum[1]}>{taskEnum[1]}</option>
                        <option value={taskEnum[2]}>{taskEnum[2]}</option>
                        <option value={taskEnum[3]}>{taskEnum[3]}</option>
                      </Form.Select>
                    </Form.Group>
                  )}
                </Col>

                <Col lg={2}>
                  <Form.Group className="mt-2">
                    <Form.Label
                      className="form-view-label"
                      htmlFor="formBasicStartDate"
                    >
                      Start Date
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name="startDate"
                      value={reportData.startDate}
                      placeholder="Enter Start Date"
                      onChange={(e) => handleChange(e)}
                    />
                    <Form.Control.Feedback type="invalid">
                      Enter Created Date.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col lg={2}>
                  <Form.Group className="mt-2">
                    <Form.Label
                      className="form-view-label"
                      htmlFor="formBasicDate"
                    >
                      End Date
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name="endDate"
                      value={reportData.endDate}
                      placeholder="Enter Last Date"
                      onChange={(e) => handleChange(e)}
                    />
                    <Form.Control.Feedback type="invalid">
                      Enter Last Date.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col lg={2}>
                  <Form.Group
                    className="mx-3 my-4"
                    style={{ display: "inline-block" }}
                  >
                    <Form.Label
                      className="form-view-label"
                      htmlFor="formBasicReport"
                    ></Form.Label>
                    <Button variant="primary" onClick={showReport}>
                      Run Report
                    </Button>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col></Col>
        </Container>
      </Row>
      {isShowReport && report.data && reportData.tableName === "lead" && (
        <LeadReportData
          showReportData={showReportData}
          reportData={reportData}
        />
      )}

      {isShowReport && reportData.tableName === "task" && (
        <TaskReportData
          showReportData={showReportData}
          reportData={reportData}
        />
      )}
    </div>
  );
};
export default ReportBuilder;
