import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Modal } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { Success, Error } from "../utils/toastStyles";
import { isNumberKey, validateEmail, validatePhoneNumber } from "../utils";
import { leadEnum, salutationEnum } from "../utils/constants";
import { useDispatch } from "react-redux";
import {
  createLead,
  getAllLeads,
  updateLead,
} from "../redux/leadReducer/leadSlice";

const LeadModal = ({
  showModel,
  handleCancel,
  titleName,
  data,
  buttonName,
}) => {
  const dispatch = useDispatch();

  const [leadRecord, setLeadRecord] = useState({
    salutation: "",
    firstName: "",
    lastName: "",
    company: "",
    phone: "",
    email: "",
    status: "",
  });

  const handleClose = () => {
    setLeadRecord({
      salutation: "",
      firstName: "",
      lastName: "",
      company: "",
      phone: "",
      email: "",
      status: "",
    });
    handleCancel(false);
   
  };

  const handleSubmit = async (e, title) => {
    if (buttonName === "Save") {
      if (
        leadRecord.firstName &&
        leadRecord.lastName &&
        leadRecord.email &&
        leadRecord.status
      ) {
        // if (!validatePhoneNumber(leadRecord.phone)) {
        //   toast.error("Invalid phone number", Error);
        //   return;
        // }
        if (!validateEmail(leadRecord.email)) {
          toast.error("Invalid email address", Error);
          return;
        }
        dispatch(createLead(leadRecord));
        dispatch(getAllLeads());
        setLeadRecord({
          salutation: "",
          firstName: "",
          lastName: "",
          company: "",
          phone: "",
          email: "",
          status: "",
        });
        handleCancel(false);
        setLeadRecord({
          salutation: "",
          firstName: "",
          lastName: "",
          company: "",
          phone: "",
          email: "",
          status: "",
        })
      } else {
        toast.error("Please fill all the required field", Error);
      }
    } else {
      if (
        leadRecord.firstName &&
        leadRecord.lastName &&
        // leadRecord.phone &&
        leadRecord.email &&
        leadRecord.status
      ) {
        // if (!validatePhoneNumber(leadRecord.phone)) {
        //   toast.error("Invalid phone number", Error);
        //   return;
        // }
        if (!validateEmail(leadRecord.email)) {
          toast.error("Invalid email address", Error);
          return;
        }
        dispatch(updateLead({ id: leadRecord._id, lead: leadRecord }));
        // dispatch(getLeadById(leadRecord._id));
        handleCancel(false);
      } else {
        toast.error("Please fill all the required field", Error);
      }
    }
  };

  const handleChange = (e) => {
    setLeadRecord({ ...leadRecord, [e.target.name]: e.target.value });
  };

  const phoneNumber = (e) => {
    setLeadRecord({
      ...leadRecord,
      phone: e.target.value.split(/\D/).join(""),
    });
  };

  useEffect(() => {
    if (buttonName === "Update") {
      setLeadRecord(data);
    }
  }, [buttonName, data]);

  return (
    <>
      <Modal show={showModel}>
        <Modal.Header closeButton onHide={handleClose}>
          <Modal.Title>{titleName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container className="view-form">
            <Form className="mt-3">
              <Row>
                <Col sm={6}>
                  <Form.Group className="mx-3">
                    {" "}
                    <Form.Label
                      className="form-view-label"
                      htmlFor="salutation"
                    >
                      Salutation{" "}
                    </Form.Label>{" "}
                    <Form.Select
                      aria-label="Select Salutation"
                      name="salutation"
                      required
                      value={leadRecord.salutation}
                      onChange={(e) => handleChange(e)}
                    >
                      <option value="">--Select--</option>
                      {salutationEnum.map((en, index) => (
                        <option value={en} key={index}>
                          {en}
                        </option>
                      ))}
                    </Form.Select>{" "}
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mx-3">
                    <Form.Label
                      className="form-view-label"
                      htmlFor="formBasicFirstName"
                    >
                      First Name<sup className="sup">*</sup>
                    </Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name="firstName"
                      placeholder="Enter firstname"
                      value={leadRecord.firstName}
                      onChange={(e) => handleChange(e)}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please fill First Name.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group className="mx-3">
                    <Form.Label
                      className="form-view-label"
                      htmlFor="formBasicLastName"
                    >
                      Last Name<sup className="sup">*</sup>
                    </Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name="lastName"
                      placeholder="Enter lastname"
                      value={leadRecord.lastName}
                      onChange={(e) => handleChange(e)}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please fill Last Name.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mx-3">
                    <Form.Label
                      className="form-view-label"
                      htmlFor="formBasicPhone"
                    >
                      Phone
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      max={10}
                      placeholder="Enter phone"
                      value={leadRecord.phone}
                      onChange={(e) => phoneNumber(e)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
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
                      placeholder="Enter email"
                      value={leadRecord.email}
                      onChange={(e) => handleChange(e)}
                    />
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group className="mx-3">
                    <Form.Label
                      className="form-view-label"
                      htmlFor="formBasicCompany"
                    >
                      Company
                    </Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name="company"
                      placeholder="Enter company"
                      value={leadRecord.company}
                      onChange={(e) => handleChange(e)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col sm={6}>
                  <Form.Group className="mx-3">
                    {" "}
                    <Form.Label
                      className="form-view-label"
                      htmlFor="salutation"
                    >
                      Status<sup className="sup">*</sup>
                    </Form.Label>{" "}
                    <Form.Select
                      aria-label="Select Status"
                      name="status"
                      required
                      value={leadRecord.status}
                      onChange={(e) => handleChange(e)}
                    >
                      <option value="">--Select Status--</option>
                      {leadEnum.map((en, index) => (
                        <option value={en} key={index}>
                          {en}
                        </option>
                      ))}
                    </Form.Select>{" "}
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>

          <Button variant="dark" onClick={handleSubmit}>
            {buttonName}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LeadModal;