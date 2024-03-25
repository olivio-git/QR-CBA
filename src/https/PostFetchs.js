import axios from "axios";

export const userLoginPost = async (user) => {
  return await axios.post("http://172.16.3.15:3001/appi/users/login", user);
};
