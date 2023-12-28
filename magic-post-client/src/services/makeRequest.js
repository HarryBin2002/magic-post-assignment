import axios from "axios";

const makeRequest = axios.create({
  baseURL: "http://localhost:8080/magic-post/v1",
  // withCredentials: true,
  // headers: {
  //   "Access-Control-Allow-Origin": "*",
  // },
  // withCredentials: true,
});

export default makeRequest;
