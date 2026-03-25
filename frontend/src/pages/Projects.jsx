import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import './Projects.css'
import Navbar from '../components/Navbar'

function Projects() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editProject, setEditProject] = useState(null)
  const [form, setForm] = useState({
    name: '',
    ownerId: '',
    startDate: '',
    endDate: ''
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await api.get('/project')
      setProjects(res.data.data || res.data)
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
    setEditProject(null)
    setForm({ name: '', ownerId: user.id, startDate: '', endDate: '' })
    setError('')
    setShowModal(true)
  }

  const openEditModal = (project) => {
    setEditProject(project)
    setForm({
      name: project.name,
      ownerId: project.ownerId,
      startDate: project.startDate?.split('T')[0],
      endDate: project.endDate?.split('T')[0]
    })
    setError('')
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editProject) {
        await api.put(`/project/${editProject.id}`, form)
      } else {
        await api.post('/project', form)
      }
      setShowModal(false)
      fetchProjects()
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return
    try {
      await api.delete(`/project/${id}`)
      fetchProjects()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete project.')
    }
  }

  if (loading) return <div className='loading'>Loading...</div>

  return (
    <div className='projects-container'>
      {/* Navbar */}
      <Navbar/>
     
      <div className='projects-content'>
        <div className='page-header'>
          <h2>Projects</h2>
          <button className='create-btn' onClick={openCreateModal}>+ New Project</button>
        </div>

        {projects.length === 0 ? (
          <div className='empty-state'>No projects found. Create one!</div>
        ) : (
          <div className='projects-grid'>
            {projects.map(p => (
              <div key={p.id} className='project-card'>
                <div className='project-card-header'>
                  <h3>{p.name}</h3>
                  <div className='project-actions'>
                    <button
                      className='edit-btn'
                      onClick={() => openEditModal(p)}>
                      Edit
                    </button>
                    <button
                      className='delete-btn'
                      onClick={() => handleDelete(p.id)}>
                      Delete
                    </button>
                  </div>
                </div>
                <p>📅 Start: {new Date(p.startDate).toLocaleDateString()}</p>
                <p>📅 End: {new Date(p.endDate).toLocaleDateString()}</p>
                <button
                  className='view-tasks-btn'
                  onClick={() => navigate(`/projects/${p.id}/tasks`)}>
                  View Tasks →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className='modal-overlay' onClick={() => setShowModal(false)}>
          <div className='modal' onClick={e => e.stopPropagation()}>
            <h3>{editProject ? 'Edit Project' : 'Create New Project'}</h3>

            {error && <div className='error-message'>{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className='form-group'>
                <label>Project Name</label>
                <input
                  type='text'
                  name='name'
                  value={form.name}
                  onChange={handleChange}
                  placeholder='Enter project name'
                  required
                />
              </div>

              <div className='form-group'>
                <label>Start Date</label>
                <input
                  type='date'
                  name='startDate'
                  value={form.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='form-group'>
                <label>End Date</label>
                <input
                  type='date'
                  name='endDate'
                  value={form.endDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='modal-actions'>
                <button type='button' className='cancel-btn' onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type='submit' className='submit-btn'>
                  {editProject ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Projects