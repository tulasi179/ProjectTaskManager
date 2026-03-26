import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import './Notifications.css'
import Navbar from '../components/Navbar'

function Notifications() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    fetchNotifications()
  }, [])

 const fetchNotifications = async () => {
  try {
    // Admin gets all notifications, User gets only theirs
    const endpoint = user.role === 'Admin' ? '/notification' : '/notification/my'
    const res = await api.get(endpoint)
    const data = res.data.data || res.data
    setNotifications(data)
  } catch (err) {
    console.error(err)
  } finally {
    setLoading(false)
  }
}

  const handleMarkAsRead = async (id) => {
    try {
      await api.patch(`/notification/${id}/read`)
      fetchNotifications()
    } catch (err) {
      console.error(err)
    }
  }

  const handleMarkAllRead = async () => {
    const unread = notifications.filter(n => !n.readStatus)
    await Promise.all(unread.map(n => api.patch(`/notification/${n.id}/read`).catch(() => {})))
    fetchNotifications()
  }

  const unreadCount = notifications.filter(n => !n.readStatus).length

  if (loading) return <div className='loading'>Loading...</div>

  return (
    <div className='notifications-container'>
      <Navbar/>
    
      <div className='notifications-content'>
        <div className='page-header'>
          <div>
            <h2>Notifications</h2>
            {unreadCount > 0 && (
              <p className='unread-count'>{unreadCount} unread</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button className='mark-all-btn' onClick={handleMarkAllRead}>
              ✓ Mark all as read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className='empty-state'>
            <p>🔔</p>
            <p>No notifications yet.</p>
          </div>
        ) : (
          <div className='notifications-list'>
            {notifications.map(n => (
              <div key={n.id} className={`notification-card ${!n.readStatus ? 'unread' : ''}`}>
                <div className='notification-body'>
                  <div className='notification-icon'>
                    {n.readStatus ? '🔔' : '🔴'}
                  </div>
                  <div className='notification-text'>
                    <p className='notification-message'>{n.message}</p>
                    <p className='notification-time'>
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                {!n.readStatus && (
                  <button
                    className='read-btn'
                    onClick={() => handleMarkAsRead(n.id)}>
                    Mark as read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications