import axios from 'axios'
//baseurl is the backend url we create an axios with name api
const api = axios.create({
  baseURL: 'http://localhost:5093/api',
})

// attachs token to every request
api.interceptors.request.use((config) => {
  //gets token form the local storage
  const token = localStorage.getItem('token')
  //it check if you areauthorized to have that response
  if (token)
    config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api

//for every request it adds JWT token like its done in scalar
// ex :- Authorization: Bearer eyJhbGciOiJIUzUxMi...