import React, { createContext, useState } from 'react';

const AdminContext = createContext({ isAdmin: false, setIsAdmin: (isAdmin: boolean) => { } });

function AdminContextProvider({ children }: { children: React.ReactNode }) {
    const [isAdmin, setIsAdmin] = useState(false);

    return (
        <AdminContext.Provider value={{ isAdmin, setIsAdmin }}>
            {children}
        </AdminContext.Provider>
    );
}

export { AdminContext, AdminContextProvider };
