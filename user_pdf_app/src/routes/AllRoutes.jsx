import React from "react";
import { Route, Routes } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import Signup from "../pages/signup";
import Login from "../pages/login";
import ViewProfile from "../pages/viewProfile";
import NotFoundPage from "../pages/notFoundPage";
import PrivateRoute from "./PrivateRoutes";

const AllRoutes = () => {
  return (
    <Box>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <ViewProfile />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>
    </Box>
  );
};

export default AllRoutes;
