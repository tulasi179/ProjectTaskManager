import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import './Tasks.css'

function Tasks() {
  const { user } = useAuth()
  const { id: projectId } = useParams()
  const navigate = useNavigate()

  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [project, setProject] = useState(null)
  const [dependencies, setDependencies] = useState([]) // all dependencies
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showDepModal, setShowDepModal] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [depTask, setDepTask] = useState(null) // task we're managing deps for
  const [error, setError] = useState('')
  const [depError, setDepError] = useState('')
  const [selectedDep, setSelectedDep] = useState('')
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
        const [usersRes, depsRes] = await Promise.all([
          api.get('/users'),
          api.get('/taskdependency')
        ])
        setUsers(usersRes.data.data || usersRes.data)
        setDependencies(depsRes.data.data || depsRes.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Get blocking task IDs for a given task
 const getBlockingTasks = (taskId) => {
  return dependencies
    .filter(d => d.dependentTaskId === taskId)  // this task is the blocked one
    .map(d => d.taskId)                          // return the blocker IDs
}

  // Check if a task is blocked (any blocking task not completed)
  const isTaskBlocked = (taskId) => {
    const blockingIds = getBlockingTasks(taskId)
    if (!blockingIds.length) return false
    return blockingIds.some(bid => {
      const blockingTask = tasks.find(t => t.id === bid)
      return blockingTask && blockingTask.status !== 'Completed'
    })
  }

  // Get names of incomplete blocking tasks
  const getBlockingNames = (taskId) => {
    const blockingIds = getBlockingTasks(taskId)
    return blockingIds
      .map(bid => tasks.find(t => t.id === bid))
      .filter(t => t && t.status !== 'Completed')
      .map(t => t.title)
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

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

  const openDepModal = (task) => {
    setDepTask(task)
    setSelectedDep('')
    setDepError('')
    setShowDepModal(true)
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

 
const handleAddDependency = async () => {
  if (!selectedDep) return
  setDepError('')
  try {
    await api.post('/taskdependency', {
      taskId: parseInt(selectedDep),   //  the blocker (must complete first)
      dependentTaskId: depTask.id      //  the blocked task
    })
    await fetchAll()
    setSelectedDep('')
  } catch (err) {
    setDepError(err.response?.data?.message || 'Failed to add dependency.')
  }
}

  const handleRemoveDependency = async (blockerId) => {
    try {
      await api.delete(`/taskdependency/${blockerId}/${depTask.id}`)
      fetchAll()
    } catch (err) {
      alert('Failed to remove dependency.')
    }
  }

  const getNextStatus = (current) => {
    if (current === 'Pending') return 'InProgress'
    if (current === 'InProgress') return 'Completed'
    return null
  }

  const getUserName = (assigneeId) => {
    if (!users.length) return `User #${assigneeId}`
    const found = users.find(u => String(u.id ?? u.Id) === String(assigneeId))
    return found ? (found.username ?? found.Username ?? `User #${assigneeId}`) : `User #${assigneeId}`
  }

  if (loading) return <div className='loading'>Loading...</div>

  return (
    <div className='tasks-container'>
      <nav className='navbar'>
        <h1>Project Task Manager</h1>
        <div className='nav-links'>
          <Link to='/dashboard'>Dashboard</Link>
          <Link to='/projects'>Projects</Link>
          <Link to='/notifications'>Notifications</Link>
          <span className='nav-user'>👤 {user.username}</span>
          <button onClick={() => { localStorage.clear(); navigate('/login') }} className='logout-btn'>Logout</button>
        </div>
      </nav>

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
                  <th>Blocked By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(t => {
                  const nextStatus = getNextStatus(t.status)
                  const blocked = isTaskBlocked(t.id)
                  const blockingNames = getBlockingNames(t.id)

                  return (
                    <tr key={t.id} className={blocked ? 'blocked-row' : ''}>
                      <td>{t.title}</td>
                      <td>{t.description || '—'}</td>
                      <td>{user.role === 'Admin' ? getUserName(t.assigneeId) : 'You'}</td>
                      <td>
                        <span className={`status-badge ${t.status?.toLowerCase()}`}>
                          {t.status}
                        </span>
                      </td>
                      <td>
                        {blockingNames.length > 0 ? (
                          <span className='blocked-badge' title={blockingNames.join(', ')}>
                            🔒 {blockingNames.length} blocking
                          </span>
                        ) : (
                          <span className='clear-badge'>✓ Clear</span>
                        )}
                      </td>
                      <td className='action-cell'>
                        {nextStatus && !blocked && (
                          <button
                            className='status-btn'
                            onClick={() => handleStatusUpdate(t, nextStatus)}>
                            → {nextStatus}
                          </button>
                        )}
                        {nextStatus && blocked && (
                          <span
                            className='blocked-status-btn'
                            title={`Blocked by: ${blockingNames.join(', ')}`}>
                            🔒 Blocked
                          </span>
                        )}
                        {user.role === 'Admin' && (
                          <>
                            <button className='dep-btn' onClick={() => openDepModal(t)}>
                              Dependencies
                            </button>
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

      {/* Task Create/Edit Modal */}
      {showModal && (
        <div className='modal-overlay' onClick={() => setShowModal(false)}>
          <div className='modal' onClick={e => e.stopPropagation()}>
            <h3>{editTask ? 'Edit Task' : 'Create New Task'}</h3>
            {error && <div className='error-message'>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className='form-group'>
                <label>Title</label>
                <input type='text' name='title' value={form.title}
                  onChange={handleChange} placeholder='Task title' required />
              </div>
              <div className='form-group'>
                <label>Description</label>
                <textarea name='description' value={form.description}
                  onChange={handleChange} placeholder='Task description' rows={3} />
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

      {/* Dependencies Modal */}
      {showDepModal && depTask && (
        <div className='modal-overlay' onClick={() => setShowDepModal(false)}>
          <div className='modal dep-modal' onClick={e => e.stopPropagation()}>
            <h3>Dependencies for: <span className='dep-task-name'>{depTask.title}</span></h3>
            <p className='dep-hint'>This task is blocked until all dependencies are Completed.</p>

            {/* Current dependencies */}
            <div className='dep-list'>
              <label>Current Blocking Tasks</label>
              {getBlockingTasks(depTask.id).length === 0 ? (
                <p className='no-deps'>No dependencies set.</p>
              ) : (
                getBlockingTasks(depTask.id).map(bid => {
                  const bt = tasks.find(t => t.id === bid)
                  return bt ? (
                    <div key={bid} className='dep-item'>
                      <span className={`status-badge ${bt.status?.toLowerCase()}`}>
                        {bt.status}
                      </span>
                      <span className='dep-item-title'>{bt.title}</span>
                      <button
                        className='remove-dep-btn'
                        onClick={() => handleRemoveDependency(bid)}>
                        ✕
                      </button>
                    </div>
                  ) : null
                })
              )}
            </div>

            {/* Add new dependency */}
            <div className='dep-add'>
              <label>Add Blocking Task</label>
              {depError && <div className='error-message'>{depError}</div>}
              <div className='dep-add-row'>
                <select
                  value={selectedDep}
                  onChange={e => setSelectedDep(e.target.value)}>
                  <option value=''>Select a task...</option>
                  {tasks
                    .filter(t =>
                      t.id !== depTask.id &&
                      !getBlockingTasks(depTask.id).includes(t.id)
                    )
                    .map(t => (
                      <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                </select>
                <button
                  className='add-dep-btn'
                  onClick={handleAddDependency}
                  disabled={!selectedDep}>
                  + Add
                </button>
              </div>
            </div>

            <div className='modal-actions'>
              <button className='cancel-btn' onClick={() => setShowDepModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Tasks