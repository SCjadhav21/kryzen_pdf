import React, { useState, createContext } from "react";

export const AddContext = createContext();

const ContextProvider = ({ children }) => {
  let user = JSON.parse(localStorage.getItem("user"));
  const [state, setState] = useState({
    userName: user?.name || "",
    token: user?.token || "",

    loading: false,
  });

  const value = { state, setState };

  return <AddContext.Provider value={value}>{children}</AddContext.Provider>;
};

export default ContextProvider;
