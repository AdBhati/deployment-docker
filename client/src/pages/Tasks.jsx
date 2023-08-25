import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Col, Row, Table } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import {
  DatatableWrapper,
  Filter,
  Pagination,
  TableBody,
  TableHeader,
} from "react-bs-datatable";
import { ShimmerTable } from "react-shimmer-effects";
import { useDispatch, useSelector } from "react-redux";
import { getAllTasks } from "../redux/taskReducer/taskSlice";
import { getPath, renderTooltipContent, timestampToMoment } from "../utils";
import { taskEnum } from "../utils/constants";
import { logout } from "../redux/userReducer/userSlice";
import { Error } from "../utils/toastStyles";
import { toast } from "react-hot-toast";
import moment from "moment";

let statusValue = "Open";
let priorityValue = "High";
const Tasks = () => {
  const [body, setBody] = useState([]);
  const navigate = useNavigate();

  const location = useLocation();
  const dispatch = useDispatch();

  const { tasks, error } = useSelector((state) => state.task.value);

  const header = [
    {
      title: "Title",
      prop: "title",
      isFilterable: true,
      cell: (row) => {
        return renderTooltipContent(row.title, `/cases/${row._id}`, 50);
      },
    },
    {
      title: "Email",
      prop: "email",
      isFilterable: true,
      cell: (row) => (
        <Link
          to={`https://mail.google.com/mail/u/0/#inbox/${row?.legacyId}`}
          style={{ textTransform: "capitalize" }}
          target="_blank"
        >
          {row.email}
        </Link>
      ),
    },
    { title: "Priority", prop: "priority", isFilterable: true },
    { title: "Status", prop: "status", isFilterable: true },
    {
      title: "Owner",
      prop: "",
      isFilterable: true,
      isSortable: true,
      cell: (row) => <>{row.ownerId ? row.ownerId.firstName : ""}</>,
    },
    {
      title: "Last Updated",
      prop: "updatedAt",
      isFilterable: true,
      isSortable: true,
      cell: (row) => <>{timestampToMoment(row.updatedAt)}</>,
    },

    {
      title: "UniqueId",
      prop: "legacyId",
      isFilterable: true,
      // cell: (row) => renderTooltipContent(row.legacyId, "", 20),
    },

    {
      title: "Lead",
      prop: "",
      isFilterable: true,
      cell: (row) =>
        renderTooltipContent(row.leadId._id, `/leads/${row.leadId._id}`, 30),
    },
  ];

  // ====== Filter on status =======
  const onFilterType = async (event) => {
    if (event.target.getAttribute("nameS") === "status") {
      statusValue = event.target.value;
    }
    if (event.target.getAttribute("nameP") === "priority") {
      priorityValue = event.target.value;
    }

    const tempData = tasks.filter((task) => {
      return task.status === statusValue && task.priority === priorityValue;
    });
    setBody(tempData);
  };

  useEffect(() => {
    const tempData = tasks.filter((task) => {
      return task.status === statusValue && task.priority === priorityValue;
    });

    setBody(tempData);
  }, [tasks]);

  useEffect(() => {
    dispatch(getAllTasks());
    if (error === "jwt expired") {
      toast.error(" session timeout please login again");

      dispatch(logout());
      navigate("/login");
    }
  }, [dispatch, error, navigate]);

  useEffect(() => {
    if (error === "jwt expired") {
      toast.error(" session timeout please login again", Error);
      dispatch(logout());
      navigate("/login");
    }
  }, [dispatch, error, navigate]);

  return (
    <>
      <Row className="g-0">
        <Col lg={2} className="mx-2">
          <Link className="nav-link" to="/">
            Home <i className="fa-solid fa-chevron-right"></i>{" "}
            {getPath(location.pathname)}
          </Link>
        </Col>
        <Col lg={12} className="p-lg-4">
          <DatatableWrapper
            body={body}
            headers={header}
            sortProps={{
              initialState: {
                prop: "updatedAt",
                order: "dsc",
              },
            }}
            paginationOptionsProps={{
              initialState: {
                rowsPerPage: 15,
                options: [5, 10, 15, 20],
              },
            }}
          >
            <Row className="mb-4">
              <Col
                xs={12}
                lg={4}
                className="d-flex flex-col justify-content-end align-items-end"
              >
                <Form.Group className="mx-3 mt-4">
                  <Form.Label className="form-view-label">Search</Form.Label>
                  <Filter />
                </Form.Group>

                <Form.Group className="mx-2  mt-4">
                  <Form.Label className="form-view-label">Status</Form.Label>
                  <Form.Select
                    aria-label="Select Status"
                    names="status"
                    onChange={onFilterType}
                    style={{ width: "120px" }}
                  >
                    {taskEnum.map((en, index) => (
                      <option value={en} key={index}>
                        {en}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col className="d-flex flex-col justify-content-left align-items-end">
                <Form.Group className="mx-3 mt-4">
                  <Form.Label className="form-view-label">Priority</Form.Label>
                  <Form.Select
                    aria-label="Select Priority"
                    nameP="priority"
                    onChange={onFilterType}
                    style={{ width: "100px" }}
                  >
                    <option value="High">High</option>
                    <option value="Normal">Normal</option>
                    <option value="Low">Low</option>
                  </Form.Select>
                </Form.Group>
              </Col>

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
            {body ? (
              <Table striped className="data-table">
                <TableHeader />

                <TableBody />
              </Table>
            ) : (
              <ShimmerTable row={4} col={6} />
            )}

            <Pagination />
          </DatatableWrapper>
        </Col>
        <Col lg={2}></Col>
      </Row>
    </>
  );
};

export default Tasks;
