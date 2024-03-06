import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || `http://localhost:3000`,
  withCredentials: true
})

const makeRequest = async (url: string, options?: object) => {
  const result = await api(url, options)
  return result.data;

}

export default makeRequest