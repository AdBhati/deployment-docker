// import { Navigate } from "react-router-dom";

// const Private = ({ children }) => {
//   const jwt = sessionStorage.getItem("jwt") ? sessionStorage.getItem("jwt") : null;
//   if (!jwt) return <Navigate to="/login" replace />;
//   return children;
// };

// export default Private;
import { Navigate } from "react-router-dom";
const Private = ({ children }) => {
  const jwt = sessionStorage.getItem("jwt") ? sessionStorage.getItem("jwt") : null;
  if (!jwt) return <Navigate to="/login" replace />;
  return (
    <div className="private-container">
      {children}
      <style jsx>{`	
        .private-container {	
          /* Add your responsive styles here */	
        }	
        	
        /* Example media query for small screens */	
        @media (max-width: 767px) {	
          .private-container {	
            /* Add styles specific to small screens */	
          }	
        }	
      `}</style>
    </div>
  );
};
export default Private;