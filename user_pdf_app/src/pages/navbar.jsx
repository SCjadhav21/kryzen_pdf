import { Box } from "@chakra-ui/react";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AddContext } from "../context/AppContext";

const Navbar = () => {
  const { state, setState } = useContext(AddContext);
  const handelLogout = () => {
    localStorage.removeItem("user");
    setState({
      userName: "",
      token: "",

      loading: false,
    });
  };
  return (
    <Box
      p={"10px"}
      backgroundColor={"#4F4BE8"}
      display={"flex"}
      justifyContent={"space-evenly"}
    >
      <Box width={"50%"}></Box>
      <Box width={"50%"} display={"flex"} justifyContent={"space-evenly"}>
        <Link to="/">
          <Box color={"#FFFFFF"}>Profile </Box>{" "}
        </Link>{" "}
        {!state.token ? (
          <Link to="/login">
            <Box color={"#FFFFFF"}>login </Box>
          </Link>
        ) : (
          <Box color={"#FFFFFF"}>{state.userName} </Box>
        )}
        {!state.token ? (
          <Link to="/signup">
            <Box color={"#FFFFFF"}>signup </Box>{" "}
          </Link>
        ) : (
          <Box onClick={handelLogout} cursor={"pointer"} color={"#FFFFFF"}>
            Logout{" "}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Navbar;
