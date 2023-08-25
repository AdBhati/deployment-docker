import React from "react";
import { useNavigate } from "react-router-dom";

const BackArrow = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <i
        className="fa-sharp fa-solid fa-arrow-left-long"
        style={{
          fontSize: "2rem",
          cursor: "pointer",
          display: "flex",
          justifyContent: "flex-end",
        }}
        onClick={goBack}
      ></i>
    </div>
  );
};

export default BackArrow;