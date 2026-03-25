import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import './Tasks.css'
import Navbar from '../components/Navbar'

function Tasks() {
  const { user } = useAuth()
  const { id: projectId } = useParams()
  const navigate = useNavigate()

  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    description: '',
    assigneeId: '',
    projectId: projectId
  })

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      const [tasksRes, projectRes] = await Promise.all([
        api.get(`/task/project/${projectId}`),
        api.get(`/project/${projectId}`)
      ])
      setTasks(tasksRes.data.data || tasksRes.data)
      setProject(projectRes.data)

      if (user.role === 'Admin') {
        const usersRes = await api.get('/users')
        const usersData = usersRes.data.data || usersRes.data
        console.log('Users API response sample:', usersData[0]) // debug
        setUsers(usersData)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const openCreateModal = () => {
    setEditTask(null)
    setForm({ title: '', description: '', assigneeId: '', projectId })
    setError('')
    setShowModal(true)
  }

  const openEditModal = (task) => {
    setEditTask(task)
    setForm({
      title: task.title,
      description: task.description,
      assigneeId: task.assigneeId,
      projectId: task.projectId
    })
    setError('')
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editTask) {
        await api.put(`/task/${editTask.id}`, {
          title: form.title,
          description: form.description,
          assigneeId: parseInt(form.assigneeId),
          projectId: parseInt(form.projectId),
          status: editTask.status
        })
      } else {
        await api.post('/task', {
          title: form.title,
          description: form.description,
          assigneeId: parseInt(form.assigneeId),
          projectId: parseInt(form.projectId)
        })
      }
      setShowModal(false)
      fetchAll()
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Something went wrong.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return
    try {
      await api.delete(`/task/${id}`)
      fetchAll()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete.')
    }
  }

  const handleStatusUpdate = async (task, newStatus) => {
    try {
      await api.patch(`/task/${task.id}/status`, { status: newStatus })
      fetchAll()
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Cannot update status.'
      alert(typeof msg === 'string' ? msg : JSON.stringify(msg))
    }
  }

  const getNextStatus = (current) => {
    if (current === 'Pending') return 'InProgress'
    if (current === 'InProgress') return 'Completed'
    return null
  }

  // Works once backend returns Id in the users response
  const getUserName = (assigneeId) => {
    if (!users.length) return `User #${assigneeId}`
    const found = users.find(u =>
      String(u.id ?? u.Id) === String(assigneeId)
    )
    return found ? (found.username ?? found.Username ?? `User #${assigneeId}`) : `User #${assigneeId}`
  }

  if (loading) return <div className='loading'>Loading...</div>

  return (
    <div className='tasks-container'>

      <Navbar/>
      <div className='tasks-content'>
        <div className='page-header'>
          <div>
            <h2>{project?.name || 'Project Tasks'}</h2>
            <p className='project-dates'>
              {project && `${new Date(project.startDate).toLocaleDateString()} → ${new Date(project.endDate).toLocaleDateString()}`}
            </p>
          </div>
          {user.role === 'Admin' && (
            <button className='create-btn' onClick={openCreateModal}>+ New Task</button>
          )}
        </div>

        {tasks.length === 0 ? (
          <div className='empty-state'>No tasks found for this project.</div>
        ) : (
          <div className='tasks-table-wrapper'>
            <table className='tasks-table'>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Assignee</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(t => {
                  const nextStatus = getNextStatus(t.status)
                  return (
                    <tr key={t.id}>
                      <td>{t.title}</td>
                      <td>{t.description || '—'}</td>
                      <td>{user.role === 'Admin' ? getUserName(t.assigneeId) : 'You'}</td>
                      <td>
                        <span className={`status-badge ${t.status?.toLowerCase()}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className='action-cell'>
                        {nextStatus && (
                          <button
                            className='status-btn'
                            onClick={() => handleStatusUpdate(t, nextStatus)}>
                            → {nextStatus}
                          </button>
                        )}
                        {user.role === 'Admin' && (
                          <>
                            <button className='edit-btn' onClick={() => openEditModal(t)}>Edit</button>
                            <button className='delete-btn' onClick={() => handleDelete(t.id)}>Delete</button>
                          </>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className='modal-overlay' onClick={() => setShowModal(false)}>
          <div className='modal' onClick={e => e.stopPropagation()}>
            <h3>{editTask ? 'Edit Task' : 'Create New Task'}</h3>
            {error && <div className='error-message'>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className='form-group'>
                <label>Title</label>
                <input
                  type='text'
                  name='title'
                  value={form.title}
                  onChange={handleChange}
                  placeholder='Task title'
                  required
                />
              </div>
              <div className='form-group'>
                <label>Description</label>
                <textarea
                  name='description'
                  value={form.description}
                  onChange={handleChange}
                  placeholder='Task description'
                  rows={3}
                />
              </div>
              <div className='form-group'>
                <label>Assign To</label>
                <select name='assigneeId' value={form.assigneeId} onChange={handleChange} required>
                  <option value=''>Select a user</option>
                  {users.map(u => (
                    <option key={u.id ?? u.Id} value={u.id ?? u.Id}>
                      {u.username ?? u.Username}
                    </option>
                  ))}
                </select>
              </div>
              <div className='modal-actions'>
                <button type='button' className='cancel-btn' onClick={() => setShowModal(false)}>Cancel</button>
                <button type='submit' className='submit-btn'>{editTask ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Tasks