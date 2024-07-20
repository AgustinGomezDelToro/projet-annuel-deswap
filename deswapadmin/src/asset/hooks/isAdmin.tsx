// AdminContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

interface AdminContextProps {
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

export const AdminContext = createContext<AdminContextProps>({
  isAdmin: false,
  setIsAdmin: () => {},
});

export const AdminContextProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <AdminContext.Provider value={{ isAdmin, setIsAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};
