import { Badge, Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import PieChart from "../components/charts/PieChart";
import { useEffect } from "react";

import { ClipLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import {
  getDashboardData,
  logout,
  resetError,
  resetUserState,
} from "../redux/userReducer/userSlice";
import { toast } from "react-hot-toast";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dashBoard, isLoading, error } = useSelector(
    (state) => state.user.value
  );

  useEffect(() => {
    dispatch(getDashboardData());

    if (error === "jwt expired") {
      toast.error(" session timeout please login again");
      dispatch(logout());
      navigate("/login");
    }
  }, [dispatch, error, navigate]);

  return (
    <Container>
      <Row className="mb-5 d-flex justify-content-around">
        <Col >

          <Link to="/cases" className="text-decoration-none ">
            <div
              className="p-3 d-flex align-items-center m-3"
              style={{
                backgroundColor: "white",
                borderLeft: "4px solid #1a293b",
              }}
            >

<span class="fa-stack fa-2x">
                <i class="fa-solid fa-circle fa-stack-2x" style={{ color: 'black' }}></i>
                <i class="fa-solid fa-tasks fa-stack-1x" style={{ color: 'white', fontSize: '2rem' }}></i>
              </span>
              
              {/* <span className="fa-stack small">
                <i
                  className="fa-solid fa-circle fa-stack-2x"
                  style={{ color: "black" }}
                ></i>
                <i
                  className="fa-solid fa-tasks fa-stack-1x"
                  style={{ color: "white", fontSize: "-2rem" }}
                ></i>
              </span> */}

              <div className="flex-grow-1">
                <h6 className="text-muted mb-1">Total Cases</h6>
                <h1 className="mb-0 d-inline ">
                  {isLoading ? (
                    <ClipLoader color="#36d7b7" size="20px" />
                  ) : (
                    dashBoard?.total
                  )}
                </h1>
                <Badge bg="light" text="dark">
                  Total
                </Badge>
              </div>
            </div>
          </Link>
        </Col>
        <Col >
          <Link to="/cases" className="text-decoration-none">
            <div
              className="p-3 d-flex align-items-center m-3"
              style={{
                backgroundColor: "white",
                borderLeft: "4px solid crimson",
              }}
            >
              <span class="fa-stack fa-2x">
                <i class="fa-solid fa-circle fa-stack-2x" style={{ color: 'red' }}></i>
                <i class="fa-solid fa-envelope-open fa-stack-1x" style={{ color: 'white', fontSize: '2rem' }}></i>
              </span>
              {/* <span className="fa-stack small">
                <i
                  className="fa-solid fa-circle fa-stack-2x"
                  style={{ color: "red" }}
                ></i>
                <i
                  className="fa-solid fa-envelope-open fa-stack-1x"
                  style={{ color: "white", fontSize: "-2rem" }}
                ></i>
              </span> */}

              <div className="flex-grow-1">
                <h6 className="text-muted mb-1">Open Cases</h6>
                <h1 className="mb-0 d-inline ">
                  {isLoading ? (
                    <ClipLoader color="#36d7b7" size="20px" />
                  ) : (
                    dashBoard?.open
                  )}
                </h1>
                <Badge bg="light" text="dark">
                  Total
                </Badge>
              </div>
            </div>
          </Link>
        </Col>
        <Col >
          <Link to="/cases" className="text-decoration-none ">
            <div
              className="p-3 d-flex align-items-center m-3"
              style={{
                backgroundColor: "white",
                borderLeft: "4px solid tomato",
              }}
            >
               <span class="fa-stack fa-2x">
                <i class="fa-solid fa-circle fa-stack-2x" style={{ color: 'orange' }}></i>
                <i class="fa-solid fa-hourglass-half fa-stack-1x" style={{ color: 'white', fontSize: '2rem' }}></i>
              </span>
              {/* <span className="fa-stack small">
                <i
                  className="fa-solid fa-circle fa-stack-2x"
                  style={{ color: "tomato" }}
                ></i>
                <i
                  className="fa-solid fa-hourglass-half fa-stack-1x"
                  style={{ color: "white", fontSize: "rem" }}
                ></i>
              </span> */}
              <div className="flex-grow-1">
                <h6 className="text-muted mb-1 ">Pending</h6>
                <h1 className="mb-0 d-inline ">
                  {isLoading ? (
                    <ClipLoader color="#36d7b7" size="20px" />
                  ) : (
                    dashBoard?.pending
                  )}
                </h1>
                <Badge bg="light" text="dark">
                  Total
                </Badge>
              </div>
            </div>
          </Link>
        </Col>
        <Col >
          <Link to="/cases" className="text-decoration-none ">
            <div
              className="p-3 d-flex align-items-center m-3"
              style={{
                backgroundColor: "white",
                borderLeft: "4px solid #198754",
              }}
            >
              <span class="fa-stack fa-2x">
                <i class="fa-solid fa-circle fa-stack-2x" style={{ color: '#198754' }}></i>
                <i class="fa-solid fa-spinner fa-stack-1x" style={{ color: 'white', fontSize: '2rem' }}></i>
              </span>
              {/* <span className="fa-stack small">
                <i
                  className="fa-solid fa-circle fa-stack-2x"
                  style={{ color: "#198754" }}
                ></i>
                <i
                  className="fa-solid fa-spinner fa-stack-1x"
                  style={{ color: "white", fontSize: "1rem" }}
                ></i>
              </span> */}
              <div className="flex-grow-1">
                <h6 className="text-muted mb-1">In Progress</h6>
                <h1 className="mb-0 d-inline ">
                  {isLoading ? (
                    <ClipLoader color="#36d7b7" size="20px" />
                  ) : (
                    dashBoard?.inProgress
                  )}
                </h1>
                <Badge bg="light" text="dark">
                  Total
                </Badge>
              </div>
            </div>
          </Link>
        </Col>

        <Col>
          <Link to="/cases" className="text-decoration-none ">
            <div
              className="p-3 d-flex align-items-center m-3"
              style={{
                backgroundColor: "white",
                borderLeft: "4px solid #4798b5",
              }}
            >
              <span class="fa-stack fa-2x">
                <i class="fa-solid fa-circle fa-stack-2x" style={{ color: '#4798b5' }}></i>
                <i class="fa-solid fa-user-clock fa-stack-1x" style={{ color: 'white', fontSize: '2rem' }}></i>
              </span>
              {/* <span className="fa-stack small">
                <i
                  className="fa-solid fa-circle fa-stack-2x"
                  style={{ color: "#4798b5" }}
                ></i>
                <i
                  className="fa-solid fa-user-clock fa-stack-1x"
                  style={{ color: "white", fontSize: "1rem" }}
                ></i>
              </span> */}
              <div className="flex-grow-1">
                <h6 className="text-muted mb-1">Closed</h6>
                <h1 className="mb-0 d-inline ">
                  {isLoading ? (
                    <ClipLoader color="#36d7b7" size="20px" />
                  ) : (
                    dashBoard?.closed
                  )}
                </h1>
                <Badge bg="light" text="dark">
                  Total
                </Badge>
              </div>
            </div>
          </Link>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col lg={12} className="text-center">
          <div className="text-center" style={{ height: "400px" }}>
            <PieChart />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
