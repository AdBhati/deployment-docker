import React, { useEffect, useState } from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/userReducer/userSlice";
import IMAGES from "../assets/images";

const Login = () => {
  const [show, setShow] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, jwt } = useSelector((state) => state.user.value);
  console.log('error is =======>', error);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(
      login({ email: credentials.email, password: credentials.password })
    );
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (error && error !== "jwt expired") {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [error]);

  useEffect(() => {
    if (jwt) navigate("/");
  }, [jwt, navigate]);

  return (
    <Container>
      <Row className="login-form p-3 mt-5">
        <Col lg={6}>
          <img src={IMAGES.LeadMangement} alt="login" />
        </Col>
        <Col lg={6} className="login-section">
          <h3 className="text-center mb-2 mt-3">
            <img src={IMAGES.batwaraLogo} style={{ width: "150px" }} alt="" />
            {/* <h4>BATWARA ASSOCIATES</h4> */}
          </h3>
          <div className="p-5">
            <Form onSubmit={handleSubmit}>
              <div className="mt-2 text-center mb-4">
                <i className="fa-solid fa-lock-open fa-2xl"></i>
                <h3 className="mt-2">Login</h3>
              </div>
              <Alert variant="danger" show={show}>
                {error}
              </Alert>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  onChange={(e) => handleChange(e)}
                  placeholder="Enter email"
                  required
                  value={credentials.email}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  onChange={(e) => handleChange(e)}
                  placeholder="Password"
                  required
                  value={credentials.password}
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Login
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
      <center className="m-4">
        <img src={IMAGES.indicrm} alt={""} />
      </center>
    </Container>
  );
};

export default Login;
