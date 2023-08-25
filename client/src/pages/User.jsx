/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import { Col, Form, Row, Table } from "react-bootstrap";
import {
  DatatableWrapper,
  Filter,
  Pagination,
  TableBody,
  TableHeader,
} from "react-bs-datatable";
import { ShimmerTable } from "react-shimmer-effects";

import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, logout } from "../redux/userReducer/userSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const User = () => {
  const [body, setBody] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const location = useLocation();
  const disptach = useDispatch();
  const navigate = useNavigate();
  const { users, error } = useSelector((state) => state.user.value);
  const getPath = (pathname) => {
    let name = pathname.split("/")[1];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // const goBack = () => {
  // 	navigate(-1);
  // }

  useEffect(() => {
    disptach(getAllUsers());
    if (error === "jwt expired") {
      toast.error(" session timeout please login again");
      disptach(logout());
      navigate("/login");
    }
  }, [disptach, error, navigate]);

  useEffect(() => {
    if (users) setAllUsers(users);
  }, [users]);

  const header = [
    {
      title: "FirstName",
      prop: "firstName",
      sortable: true,
      isFilterable: true,
      cell: (row) => (
        <Link to="/profile" state={{ row: row }}>
          {row.firstName}
        </Link>
      ),
    },
    // {
    //   title: "LastName",
    //   prop: "lastName",
    //   sortable: true,
    //   isFilterable: true,
    //   cell: (row) => <Link to={`/user/${row._id}`}>{row.lastName}</Link>,
    // },

    { title: "Email", prop: "email", isFilterable: true },
  ];

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
            body={allUsers}
            headers={header}
            paginationOptionsProps={{
              initialState: {
                rowsPerPage: 10,
                options: [5, 10, 15, 20],
              },
            }}
          >
            <Row className="mb-4">
              <Col lg={4}>
                <Form.Group>
                  <Form.Label>Search</Form.Label>
                  <Filter />
                </Form.Group>
              </Col>
            </Row>
            {allUsers ? (
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

export default User;
