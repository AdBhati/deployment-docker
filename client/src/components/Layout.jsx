import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar/Sidebar";
import Header from "./header/Header";
import { useSelector } from "react-redux";

const Layout = ({ children }) => {
  const [className, setClassName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const { user } = useSelector((state) => state.user.value);

  useEffect(() => {
    if (user && (user.role === "ADMIN" || user.role === "SUPER_ADMIN")) {
      setIsAdmin(true);
    }
  }, [user]);

  const changeClassName = (value) => {
    setClassName(value);
  };
  return (
    <div className="wrapper">
      <Sidebar className={className} isAdmin={isAdmin} />
      <div id="content">
        <Header changeClassName={(value) => changeClassName(value)} />
        {children}
      </div>
    </div>
  );
};

export default Layout;
