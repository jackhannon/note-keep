import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
})

const makeRequest = async (url: string, options?: object) => {
  console.log(options)
  const result = await api(url, options)
  return result.data
}

export default makeRequest