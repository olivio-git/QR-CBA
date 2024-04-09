import React, { createContext, useState } from 'react'; 
import { getEvents } from '../https/GetFetchs';

export const DataContext = createContext();

export const DataContextProvider = ({children})=>{ 
    const [auth,setAuth] = useState({ //contexto de usuario logeado
        user:null
    })
    const [dataEvents,setDataEvents ] = useState({ //contexto de eventos
      data:null,
      indicator:false
    })
    const [selectedEventoDetails, setSelectEventDetails] = useState(null); //contexto de estado 

    const setDataAuth = (data) => { 
        setAuth({
          ...auth,
          user:data
        });
    };
    const handleChargeDataEvents = async () => {
      try {
        setDataEvents({
          ...dataEvents,
          indicator:true
        })
        const response = await getEvents();
        setDataEvents({
          ...dataEvents,
          data: response.data.results.datosEvento,
          indicator:false
        });
        console.log(response.data.results.datosEvento);
      } catch (error) {
        console.log(JSON.stringify(error));
      }
    };
    const handleSetSelectedEvent = (value) => {
      setSelectEventDetails(value)
    }
    const STATES_MODIFIC = {
      auth,
      setDataAuth,
      dataEvents,
      setDataEvents,
      handleChargeDataEvents,
      selectedEventoDetails,
      handleSetSelectedEvent,
    };
    return (
      <DataContext.Provider value={STATES_MODIFIC}>
        {children}
      </DataContext.Provider>
    );
}