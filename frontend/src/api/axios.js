// import axios from 'axios'
// //baseurl is the backend url we create an axios with name api
// const api = axios.create({
//   baseURL: 'http://localhost:5093/api',
// })

// // attachs token to every request
// api.interceptors.request.use((config) => {
//   //gets token form the local storage
//   const token = localStorage.getItem('token')
//   //it check if you areauthorized to have that response
//   if (token)
//     config.headers.Authorization = `Bearer ${token}`
//   return config
// })

// export default api

// //for every request it adds JWT token like its done in scalar
// // ex :- Authorization: Bearer eyJhbGciOiJIUzUxMi...




//----------------------------------------------------------------------------------

import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5093/api',
})

// Request interceptor - attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token)
    config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor - auto refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    // If 401 and not already retried
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')

        if (!refreshToken) {
          localStorage.clear()
          window.location.href = '/login'
          return Promise.reject(error)
        }

        // Call refresh endpoint
        const res = await axios.post('http://localhost:5093/api/auth/refresh-token', {
          refreshToken
        })

        const newToken = res.data.accessToken || res.data.AccessToken
        const newRefreshToken = res.data.refreshToken || res.data.RefreshToken

        // Save new tokens
        localStorage.setItem('token', newToken)
        if (newRefreshToken)
          localStorage.setItem('refreshToken', newRefreshToken)

        // Retry original request with new token
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)

      } catch (refreshError) {
        // Refresh failed - force logout
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api