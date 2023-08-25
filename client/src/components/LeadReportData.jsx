import React, { useEffect, useState } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import {
  DatatableWrapper,
  Filter,
  Pagination,
  TableBody,
  TableHeader,
} from "react-bs-datatable";
import { useDispatch, useSelector } from "react-redux";
import { leadBackup } from "../redux/reportReducer/reportSlice";
import { toast } from "react-hot-toast";

const LeadReportData = ({ showReportData, reportData }) => {

  const [showDataTable, setShowDataTable] = useState(true);

  const dispatch = useDispatch();
  const { message } = useSelector((state) => state.report.value);


  const header = [
    { title: "FirstName", prop: "firstName", isFilterable: true, isSortable: true},
    { title: "LastName", prop: "lastName", isFilterable: true,isSortable: true},
    { title: "Email", prop: "email", isFilterable: true, isSortable: true },
    { title: "Status", prop: "status", isFilterable: true, isSortable: true },
    { title: "UpdatedAt", prop: "updatedAt", isFilterable: true, isSortable: true},
    { title: "Type", prop: "type", isFilterable: true, isSortable: true },
  ];

  const handleExportCsv = async () => {
    dispatch(leadBackup(reportData));
    setShowDataTable(false);
  };

  useEffect(() => {
    if (!showDataTable && message) {
      toast.success(message);
    }
  }, [message, dispatch, showDataTable]);

  return (
    <div>
      <Row className="g-0">
        <Col lg={2} className="mx-2"></Col>

        <Col lg={12} className="p-lg-4">
          {showDataTable ? (
            <DatatableWrapper
              body={showReportData}
              headers={header}
              paginationOptionsProps={{
                initialState: {
                  rowsPerPage: 10,
                  options: [5, 10, 15, 20],
                },
              }}
            >
              <row>
                <p style={{ fontSize: "small" }}>Report Name</p>
              </row>

              <Row className="mb-4">
                <Col
                  xs={2}
                  lg={2}
                  className="d-flex flex-col justify-content-end align-items-end"
                >
                  <Filter />
                </Col>
                <Col
                  xs={4}
                  sm={10}
                  lg={10}
                  className="d-flex flex-col justify-content-end align-items-end"
                >
                  <Button
                    className="btn-sm-2"
                    variant="outline-primary"
                    onClick={() => handleExportCsv()}
                  >
                    Export CSV
                  </Button>
                </Col>
              </Row>
              <Table striped className="data-table">
                <TableHeader />
                <TableBody />
              </Table>
              <Pagination />
            </DatatableWrapper>
          ) : (
            ""
          )}
        </Col>
        <Col lg={2}></Col>
      </Row>
    </div>
  );
};

export default LeadReportData;
