import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import './Dashboard.css'

import Navbar from '../components/Navbar'

import AdminSection from './AdminSection'
import UserSection from './UserSection'

function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchData()
  }, [])

 const fetchData = async () => {
  try {
    if (user.role === 'Admin') {
      const [projectsRes, tasksRes] = await Promise.all([
        api.get('/project'),
        api.get('/task')
      ])
      setProjects(projectsRes.data.data || projectsRes.data)
      setTasks(tasksRes.data.data || tasksRes.data)

    } else {
      const projectsRes = await api.get('/project')
      const allProjects = projectsRes.data.data || projectsRes.data

      if (Array.isArray(allProjects) && allProjects.length > 0) {
        const taskResults = await Promise.allSettled(
          allProjects.map(p => api.get(`/task/project/${p.id}`))
        )
        const allTasks = taskResults
          .filter(r => r.status === 'fulfilled')
          .flatMap(r => r.value.data.data || r.value.data || [])

        setTasks(allTasks)
      } else {
        setTasks([])
      }
    }

    // ✅ Same endpoint for both roles — backend uses JWT to filter
    const notifRes = await api.get('/notification')
    setNotifications(notifRes.data.data || notifRes.data)

  } catch (err) {
    console.error('Dashboard fetch error:', err)
  } finally {
    setLoading(false)
  }
}



  if (loading) return <div className='loading'>Loading...</div>

  return (
    <div className='dashboard-container'>
      <Navbar />

      {user.role === 'Admin' ? (
        <AdminSection
          user={user}
          projects={projects}
          tasks={tasks}
          notifications={notifications}
        />
      ) : (
        <UserSection
          user={user}
          tasks={tasks}
          notifications={notifications}
          onStatusUpdate={fetchData} 
        />
      )}
    </div>
  )
}

export default Dashboard