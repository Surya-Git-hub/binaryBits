"use client"
import { createContext, useState } from "react";
export const authContext = createContext(null);
function Context({ children }) {
  const [auth, setAuth] = useState({
    status: false,
    id: ""
  });


  return (
    <authContext.Provider value={{ auth, setAuth }}>
      {children}
    </authContext.Provider>
  );
}

export default Context;