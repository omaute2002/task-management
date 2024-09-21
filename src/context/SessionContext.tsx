"use client";

import { createContext, useState, useContext, ReactNode, useEffect } from "react";

import { decodeToken } from "@/lib/auth";

interface SessionContextType {  
  sessionInfo: any | null;
  setSessionInfo: React.Dispatch<React.SetStateAction<any | null>>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [sessionInfo, setSessionInfo] = useState<any | null>(null); // Initialize as null
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decodedUser = decodeToken(token);
      if (decodedUser) {
        // console.log(decodedUser);
        
        setSessionInfo(decodedUser);
      }
    }
  }, []);
  return (
    <SessionContext.Provider value={{ sessionInfo, setSessionInfo }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
