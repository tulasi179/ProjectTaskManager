import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [showProfile, setShowProfile] = useState(false)
  const [profileData, setProfileData] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState('')
  const [pwLoading, setPwLoading] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const openProfile = async () => {
    setShowProfile(true)
    setShowChangePassword(false)
    setPwError('')
    setPwSuccess('')
    setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })

    if (!profileData) {
      setLoadingProfile(true)
      try {
        const res = await api.get(`/users/${user.id}`)
        setProfileData(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingProfile(false)
      }
    }
  }

  const handlePwChange = (e) => {
    setPwForm({ ...pwForm, [e.target.name]: e.target.value })
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPwError('')
    setPwSuccess('')

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('New passwords do not match.')
      return
    }
    if (pwForm.newPassword.length < 6) {
      setPwError('New password must be at least 6 characters.')
      return
    }

    setPwLoading(true)
    try {
      await api.patch('/users/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword
      })
      setPwSuccess('Password changed successfully!')
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setShowChangePassword(false)
    } catch (err) {
      setPwError(err.response?.data?.message || err.response?.data || 'Failed to change password.')
    } finally {
      setPwLoading(false)
    }
  }

  if (!user) return null

  return (
    <>
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

          {/* Clickable username opens profile */}
          <span className='nav-user' onClick={openProfile}>
            👤 {user.username}
          </span>

          <button className='logout-btn' onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* Profile Modal */}
      {showProfile && (
        <div className='modal-overlay' onClick={() => setShowProfile(false)}>
          <div className='modal profile-modal' onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className='profile-header'>
              <div className='profile-avatar'>
                {user.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3>{user.username}</h3>
                <span className='profile-role-badge'>{user.role}</span>
              </div>
              <button className='modal-close' onClick={() => setShowProfile(false)}>✕</button>
            </div>

            {/* Profile Info */}
            {loadingProfile ? (
              <p className='profile-loading'>Loading...</p>
            ) : profileData ? (
              <div className='profile-info'>
                <div className='profile-field'>
                  <label>Username</label>
                  <span>{profileData.username || profileData.Username}</span>
                </div>
                <div className='profile-field'>
                  <label>Email</label>
                  <span>{profileData.email || profileData.Email}</span>
                </div>
                <div className='profile-field'>
                  <label>Role</label>
                  <span>{profileData.role || profileData.Role}</span>
                </div>
                <div className='profile-field'>
                  <label>Status</label>
                  <span className={profileData.isActive || profileData.IsActive ? 'active-status' : 'inactive-status'}>
                    {profileData.isActive || profileData.IsActive ? '● Active' : '● Inactive'}
                  </span>
                </div>
              </div>
            ) : null}

            {/* Change Password Toggle */}
            <button
              className='change-pw-toggle'
              onClick={() => {
                setShowChangePassword(!showChangePassword)
                setPwError('')
                setPwSuccess('')
              }}>
              {showChangePassword ? '✕ Cancel' : '🔒 Change Password'}
            </button>

            {pwSuccess && <div className='pw-success'>{pwSuccess}</div>}

            {/* Change Password Form */}
            {showChangePassword && (
              <form onSubmit={handleChangePassword} className='pw-form'>
                {pwError && <div className='error-message'>{pwError}</div>}
                <div className='form-group'>
                  <label>Current Password</label>
                  <input
                    type='password'
                    name='currentPassword'
                    value={pwForm.currentPassword}
                    onChange={handlePwChange}
                    placeholder='Enter current password'
                    required
                  />
                </div>
                <div className='form-group'>
                  <label>New Password</label>
                  <input
                    type='password'
                    name='newPassword'
                    value={pwForm.newPassword}
                    onChange={handlePwChange}
                    placeholder='Enter new password'
                    required
                  />
                </div>
                <div className='form-group'>
                  <label>Confirm New Password</label>
                  <input
                    type='password'
                    name='confirmPassword'
                    value={pwForm.confirmPassword}
                    onChange={handlePwChange}
                    placeholder='Confirm new password'
                    required
                  />
                </div>
                <button type='submit' className='submit-btn' disabled={pwLoading}>
                  {pwLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar