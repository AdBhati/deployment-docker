import "./assets/css/app-new.css";
import "./assets/css/sidebar.css";
import "bootstrap/dist/css/bootstrap.min.css";
// import "react-phone-number-input/style.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Error from "./pages/Error";
import Private from "./components/Private";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import { Toaster } from "react-hot-toast";
import Leads from "./pages/Leads";
import Tasks from "./pages/Tasks";
import LeadView from "./components/LeadView";
import TaskView from "./components/TaskView";
import Profile from "./components/Profile";
import User from "./pages/User";
import ReportBuilder from "./pages/ReportBuilder";

const App = () => {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <Private>
              <Layout>
                <Home />
              </Layout>
            </Private>
          }
        />
        <Route
          path="/leads"
          element={
            <Private>
              <Layout>
                <Leads />
              </Layout>
            </Private>
          }
        />
        <Route
          path="/leads/:id"
          element={
            <Private>
              <Layout>
                <LeadView />
              </Layout>
            </Private>
          }
        />

        <Route
          path="/cases"
          element={
            <Private>
              <Layout>
                <Tasks />
              </Layout>
            </Private>
          }
        />

        <Route
          path="/cases/:id"
          element={
            <Private>
              <Layout>
                <TaskView />
              </Layout>
            </Private>
          }
        />
        <Route
          path="/reports"
          element={
            <Private>
              <Layout>
                <ReportBuilder />
              </Layout>
            </Private>
          }
        />

        <Route
          path="/profile"
          element={
            <Private>
              <Layout>
                <Profile />
              </Layout>
            </Private>
          }
        />

        <Route
          path="/users"
          element={
            <Private>
              <Layout>
                <User />
              </Layout>
            </Private>
          }
        />

        <Route
          path="/404"
          element={
            <Private>
              <Layout>
                <Error />
              </Layout>
            </Private>
          }
        />

        <Route path="/404" element={<Error />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
