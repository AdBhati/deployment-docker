import React, { useEffect } from "react";
import { useState } from "react";
import { Button, Card, Container } from "react-bootstrap";
import { Col, Row, Table, Form } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import {
  DatatableWrapper,
  Pagination,
  TableBody,
  TableHeader,
} from "react-bs-datatable";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { useDispatch, useSelector } from "react-redux";
import { getTasksByLeadId, isPopup } from "../redux/taskReducer/taskSlice";
import TaskModal from "./TaskModal";
import { getLeadByIdRemarks } from "../redux/leadReducer/leadSlice";
const LowerTaskView = () => {
  const [relatedListTasks, setRelatedListTasks] = useState(true);
  const [buttonName, setButtonName] = useState("");
  const [remarksData, setRemarksData] = useState([]);
  const dispatch = useDispatch();
  const params = useParams();
  const { leadRelatedTasks } = useSelector((state) => state.task.value);
  const { leadsRemarks } = useSelector((state) => state.lead.value);

  const handleSelect = (key) => {
    if (key === "tasks") {
      setRelatedListTasks(true);
    } else if (key === "remarks") {
      setRelatedListTasks(false);
      const filteredRemarks = leadsRemarks.filter((item) => item?.remarks);
      setRemarksData(filteredRemarks);
      // dispatch(getLeadByIdRemarks(params.id))
    }
  };

  const handleNewTask = () => {
    dispatch(isPopup(true));
    setButtonName("Save");
  };

  useEffect(() => {
    dispatch(getTasksByLeadId(params.id));
  }, [dispatch, params.id]);

  useEffect(() => {
    dispatch(getLeadByIdRemarks(params.id));
  }, [dispatch, params.id]);

  const header = [
    {
      title: "Title",
      prop: "title",
      isFilterable: true,
      cell: (row) => <Link to={`/cases/${row._id}`}>{row.title}</Link>,
    },

    {
      title: "Email",
      prop: "email",
      isFilterable: true,
    },
    { title: "Priority", prop: "priority", isFilterable: true },
    { title: "Status", prop: "status", isFilterable: true },
    {
      title: "Owner",
      prop: "",
      isFilterable: true,
      cell: (row) => (
        <>
          {row.ownerId.firstName} {row.ownerId.lastName}
        </>
      ),
    },
    { title: "Lead", prop: "leadId", isFilterable: true },
  ];

  const headerForRemarks = [
    {
      title: "Title",
      prop: "title",
      isFilterable: true,
      cell: (row) => (
        <Link
          to={`/cases/${row._id}`}
          style={row.isCompleted ? { textDecoration: "line-through" } : {}}
        >
          {row.title}
        </Link>
      ),
    },
    {
      title: "Remarks",
      prop: "remarks",
      isFilterable: true,
      cell: (row) => (
        <span style={row.isCompleted ? { textDecoration: "line-through" } : {}}>
          {row.remarks}
        </span>
      ),
    },
    {
      title: "Completed",
      prop: "isCompleted",
      isFilterable: true,
      cell: (row) => (
        <Form.Check type="checkbox" checked={row.isCompleted} disabled />
      ),
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "40rem",
      }}
    >
      <TaskModal buttonName={buttonName} title="New Case" />

      <Container maxwidth="xs">
        <Card bg="light" text="dark" className="mb-2 mt-4">
          <Card.Header className="d-flex justify-content-between">
            <Tabs
              defaultActiveKey="tasks"
              id="uncontrolled-tab-example"
              onSelect={(key) => handleSelect(key)}
            >
              <Tab eventKey="tasks" title="Cases"></Tab>
              <Tab eventKey="remarks" title="Remarks"></Tab>
            </Tabs>

            <Button
              className="float-right btn-sm"
              onClick={() => handleNewTask()}
            >
              New Case
            </Button>
          </Card.Header>
          <Card.Body>
            {relatedListTasks ? (
              <>
                <Row className="g-0">
                  <Col lg={12} className="">
                    <DatatableWrapper
                      body={leadRelatedTasks.length > 0 ? leadRelatedTasks : []}
                      headers={header}
                      paginationOptionsProps={{
                        initialState: {
                          rowsPerPage: 5,
                          options: [5, 10, 15, 20],
                        },
                      }}
                    >
                      <Row className="mb-4">
                        <Col
                          xs={12}
                          lg={4}
                          className="d-flex flex-col justify-content-end align-items-end"
                        ></Col>
                        <Col
                          xs={12}
                          sm={6}
                          lg={4}
                          className="d-flex flex-col justify-content-start align-items-start"
                        ></Col>
                        <Col
                          xs={12}
                          sm={6}
                          lg={4}
                          className="d-flex flex-col justify-content-end align-items-end"
                        ></Col>
                      </Row>
                      {leadRelatedTasks ? (
                        <Table striped className="data-table">
                          <TableHeader />

                          <TableBody />
                        </Table>
                      ) : (
                        <Table striped className="data-table">
                          <TableHeader />

                          <p>Task is not availabele</p>
                        </Table>
                      )}
                      <Pagination />
                    </DatatableWrapper>
                  </Col>
                  <Col lg={2}></Col>
                </Row>
              </>
            ) : (
              <>
                <Row className="g-0">
                  <Col lg={12} className="">
                    <DatatableWrapper
                      body={remarksData.length > 0 ? remarksData : []}
                      headers={headerForRemarks}
                      paginationOptionsProps={{
                        initialState: {
                          rowsPerPage: 5,
                          options: [5, 10, 15, 20],
                        },
                      }}
                    >
                      <Row className="mb-4">
                        <Col
                          xs={12}
                          lg={4}
                          className="d-flex flex-col justify-content-end align-items-end"
                        ></Col>
                        <Col
                          xs={12}
                          sm={6}
                          lg={4}
                          className="d-flex flex-col justify-content-start align-items-start"
                        ></Col>
                        <Col
                          xs={12}
                          sm={6}
                          lg={4}
                          className="d-flex flex-col justify-content-end align-items-end"
                        ></Col>
                      </Row>
                      {remarksData ? (
                        <Table striped className="data-table">
                          <TableHeader />

                          <TableBody />
                        </Table>
                      ) : (
                        <Table striped className="data-table">
                          <TableHeader />

                          <p>Task is not availabele</p>
                        </Table>
                      )}
                      <Pagination />
                    </DatatableWrapper>
                  </Col>
                  <Col lg={2}></Col>
                </Row>
              </>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default LowerTaskView;
