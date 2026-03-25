import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) return null

  return (
    <nav className='navbar'>
      <h1>Project Task Manager</h1>

      <div className='nav-links'>
        
        {location.pathname !== '/dashboard' && (
          <Link to='/dashboard'>Dashboard</Link>
        )}

        {user.role === 'Admin' && location.pathname !== '/projects' && (
          <Link to='/projects'>Projects</Link>
        )}

        {location.pathname !== '/notifications' && (
          <Link to='/notifications'>Notifications</Link>
        )}

        <span>👤 {user.username}</span>

        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  )
}

export default Navbar