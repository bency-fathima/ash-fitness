// import { isAuthenticated } from "@/utils/auth";
// import React from "react";
// import { Navigate } from "react-router-dom";

// const PublicRoutes = ({ children }) => {
//   if (isAuthenticated()) {
//    return <Navigate to="/" replace />;
//   }
//   return children;
// };
// export default PublicRoutes;

import { Navigate } from "react-router-dom";

const getHomeByRole = () => {
  const role = localStorage.getItem("role");

  switch (role) {
    case "founder":
      return "/founder";
    case "head":
      return "/head";
    case "admin":
      return "/admin";
    case "expert":
      return "/expert";
    default:
      return "/login";
  }
};

const PublicRoutes = ({ children }) => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to={getHomeByRole()} replace />;
  }

  return children;
};

export default PublicRoutes;
