import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import './Login.css'

function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')//error handling stores error like invalid username or pass
  const [loading, setLoading] = useState(false)//while handling the request status , disable button, shows signing in...
  const { login } = useAuth()//get login() from authcontext
  const navigate = useNavigate()//naivgate to dashboard

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  

  const handleSubmit = async (e) => {
    e.preventDefault()
    //stops form from refreshing pages
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', {
        username: form.username,
        password: form.password,
        email: '',
        role: ''
      })

      const { accessToken, refreshToken } = res.data//extract JWT token from the response
      

      // Decode token to get user info
      const payload = JSON.parse(atob(accessToken.split('.')[1]))
      const userData = {
        id: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
        username: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
        role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      }
      //from the accesstoken extarct the data of the users like id , username, role

      login(userData, accessToken, refreshToken)

      // Redirect to dashboard depending on role
      if (userData.role === 'Admin')
        navigate('/dashboard')
      else
        navigate('/dashboard')

    } catch (err) {
      setError(err.response?.data || 'Invalid username or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='login-container'>
      <div className='login-box'>
        <h2>Project Task Manager</h2>
        <p className='login-subtitle'>Sign in to your account</p>

        {error && <div className='error-message'>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>Username</label>
            <input
              type='text'
              name='username'
              value={form.username}
              onChange={handleChange}
              placeholder='Enter your username'
              required
            />
          </div>

          <div className='form-group'>
            <label>Password</label>
            <input
              type='password'
              name='password'
              value={form.password}
              onChange={handleChange}
              placeholder='Enter your password'
              required
            />
          </div>

          <button type='submit' className='login-btn' disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className='register-link'>
          Don't have an account? <Link to='/register'>Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login