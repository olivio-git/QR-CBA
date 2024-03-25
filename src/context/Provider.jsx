import React, { createContext, useState } from 'react'; 

export const DataContext = createContext();

export const DataContextProvider = ({children})=>{ 
    const [auth,setAuth] = useState({
        user:null
    })
    const setDataAuth = (data) => { 
        setAuth({
          ...auth,
          user:data
        });
    };
    const STATES_MODIFIC = {
      auth,
      setDataAuth,
    };
    return (
      <DataContext.Provider value={STATES_MODIFIC}>
        {children}
      </DataContext.Provider>
    );
}