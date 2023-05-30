"use client"
import { createContext, useState } from "react";
export const user_data = createContext(null);
function Context({ children }) {
    const [userName, setUserName] = useState();
    const [userEmail, setUserEmail] = useState();

  
    return (
      <user_data.Provider value={{ userName,userEmail,setUserName,setUserEmail }}>
        {children}
      </user_data.Provider>
    );
  }

export default Context;