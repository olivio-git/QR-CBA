import axios from "axios";
import { apiUrl, apiPlus } from "../config/configGlobal.json";

const options = {
  Admin: async (user) => {
    const format = {
      correo: user.email,
      password: user.password,
    };
    return await axios.post(`http://${apiUrl}/appi/users/login`, format, {
      withCredentials: true,
      contentType: "application/json",
    });
  },
  Student: async (user) => {
    return await axios.post(`http://${apiPlus}/api/auth/login`, user);
  },
  Teacher: async () => {
    return await axios.post(`http://${apiUrl}/api/auth/login`, user, {
      withCredentials: true,
      contentType: "application/json",
    });
  },
};
export const userLoginPost = async (user, option) => {
  return options[option](user);
};

export const responseData = async () => {
  return await axios.get(`http://${apiUrl}/appi/datosevento`);
};
export const validateSessionWebApi = async (token) => {
  // const hasSpecialCharacter = token.includes("|");
  return await axios.post(`http://${apiUrl}/appi/users/valid/token/mobile`, {
    token,
  });
};
export const validateSessionCbaPlus = async (token) => {
  return await axios.post(
    `http://${apiPlus}/api/auth/validate`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const generateQrCode = async (data) => {
  // const hasSpecialCharacter = token.includes("|");
  return await axios.post(`http://${apiUrl}/appi/QR/generarQR`, data);
};
export const uploadFle = async (fs) => {
  return await axios.post(`http://${apiUrl}/appi/files/upload`, {
    filePath: fs,
    type: "image",
  });
};

export const createEvent = async (fs) => {
  return await axios.post(`http://${apiUrl}/appi/datosevento/create`, fs);
};
