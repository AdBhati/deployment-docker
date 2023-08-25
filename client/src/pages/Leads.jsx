/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Col, Row, Table } from "react-bootstrap";
import {
  DatatableWrapper,
  Filter,
  Pagination,
  TableBody,
  TableHeader,
} from "react-bs-datatable";
import { ShimmerTable } from "react-shimmer-effects";
import Form from "react-bootstrap/Form";
import { logout } from "../redux/userReducer/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { getAllLeads } from "../redux/leadReducer/leadSlice";

import { getPath, renderTooltipContent, timestampToMoment } from "../utils";
import { leadEnum } from "../utils/constants";
import BackArrow from "../components/BackArrow";
import LeadModal from "../components/LeadModal";
import { toast } from "react-hot-toast";

const Leads = () => {
  const navigate = useNavigate();
  const [body, setBody] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [titleName, setTitleName] = useState("Create Lead");
  const location = useLocation();
  const dispatch = useDispatch();
  const { leads, error } = useSelector((state) => state.lead.value);

  const handleShowModel = () => {
    setShowModel(true);
  };

  const handleCancel = (data) => {
    setShowModel(data);
  };

  useEffect(() => {
    dispatch(getAllLeads());
  }, [dispatch]);

  useEffect(() => {
    if (error === "jwt expired") {
      toast.error(" session timeout please login again");
      dispatch(logout());
      navigate("/login");
    }
  }, [body, dispatch, error, navigate]);

  useEffect(() => {
    if (leads) {
      const temp = leads.filter((item) => {
        return item.status === "Open";
      });

      setBody(temp);
    }
  }, [leads]);

  const header = [
    {
      title: "FirstName",
      prop: "firstName",
      isSortable: true,
      isFilterable: true,
      cell: (row) => (
        <Link to={`/leads/${row._id}`} style={{ textTransform: "capitalize" }}>
          {row.firstName}
        </Link>
      ),
    },
    {
      title: "LastName",
      prop: "lastName",
      isSortable: true,

      isFilterable: true,
      cell: (row) => (
        <Link to={`/leads/${row._id}`} style={{ textTransform: "capitalize" }}>
          {row.lastName}
        </Link>
      ),
    },

    {
      title: "Email",
      prop: "email",
      isSortable: true,
      isFilterable: true,
      cell: (row) => (
        <Link
          to={`https://mail.google.com/mail/u/0/#inbox/${row?.taskIds[0]?.legacyId}`}
          style={{ textTransform: "capitalize" }}
          target="_blank"
        >
          {row.email}
        </Link>
      ),
    },
    {
      title: "Status",
      prop: "status",
      isSortable: true,

      isFilterable: true,
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
      cell: (row) =>
        renderTooltipContent(
          row.legacyId === undefined ? "" : row.legacyId,
          "",
          20
        ),
    },
    {
      title: "Type",
      prop: "type",
      isSortable: true,

      isFilterable: true,
    },
  ];

  // ====== Filter on status =======
  const onFilterType = (event) => {
    const tempData = leads.filter((lead) => lead.status === event.target.value);
    setBody(tempData);
  };

  return (
    <>
      <LeadModal
        showModel={showModel}
        handleCancel={handleCancel}
        titleName={titleName}
        buttonName="Save"
      />

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
                <Form.Group className="mx-3 mt-4">
                  <Form.Label className="form-view-label">Status</Form.Label>
                  <Form.Select
                    aria-label="Select Status"
                    name="status"
                    onChange={onFilterType}
                    style={{ width: "100px" }}
                  >
                    {/* <option value="All">All</option> */}
                    {leadEnum.map((en, index) => (
                      <option value={en} key={index}>
                        {en}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col
                xs={12}
                sm={8}
                lg={4}
                className="d-flex flex-col justify-content-start align-items-start"
              ></Col>
              <Col
                xs={12}
                sm={6}
                lg={4}
                className="d-flex flex-col justify-content-end align-items-end"
              >
                <Button
                  className="btn-sm"
                  variant="outline-primary"
                  onClick={() => handleShowModel()}
                  disabled
                >
                  New Lead
                </Button>
              </Col>
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

export default Leads;
