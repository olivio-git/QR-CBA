import axios from "axios";
import { apiUrl } from "../config/configGlobal.json";

export const getEvents = async () => {
  return await axios.get(`http://${apiUrl}/appi/datosevento`);
}; 

export const getEventDetail = async (id) => {
  return await axios.get(`http://${apiUrl}/appi/event/getById/${id}`);
}; 