import axios from "axios";
import { apiUrl } from "../config/configGlobal.json";

const options = {
  Admin: async (user) => {
    //login con webpage api
    const format = {
      correo: user.email,
      password: user.password,
    };
    return await axios.post(
      `http://${apiUrl}/appi/users/login`,
      format,
      {
        withCredentials: true,
        contentType: "application/json",
      }
    );
  },
  Student: async (user) => {
    console.log("student");
    //login con cbaplus api
    return await axios.post(`http://${apiUrl}/api/auth/login`, user);
  },
  Teacher: async () => {
    //aun está por verse
    return await axios.post(`http://${apiUrl}/api/auth/login`, user, {
      withCredentials: true,
      contentType: "application/json",
    });
  },
};
export const userLoginPost = async (user, option) => {
  console.log("object2");
  return options[option](user);
  // return await axios.post("http://192.168.0.15:3001/appi/users/login", user, {
  //   withCredentials: true,
  //   contentType: "application/json",
  // });
};
export const responseData = async () => {
  return await axios.get(`http://${apiUrl}/appi/datosevento`);
};
export const validateSession = async (token) => {
  // const config = {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // };
  const data = {
    validation: "Validation",
  };
  return await axios.post(`http://${apiUrl}/appi/users/valid/token/mobile`, {
    token,
  });
};
