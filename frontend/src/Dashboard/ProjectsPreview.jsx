import { useNavigate, Link } from 'react-router-dom'

function ProjectsPreview({ projects }) {
  const navigate = useNavigate()

  return (
    <div className='section'>
      <div className='section-header'>
        <h3>Projects</h3>
        <Link to='/projects' className='view-all'>View All →</Link>
      </div>

      <div className='projects-grid'>
        {projects.slice(0, 4).map(p => (
          <div
            key={p.id}
            className='project-card'
            onClick={() => navigate(`/projects/${p.id}/tasks`)}
          >
            <h4>{p.name}</h4>
            <p>Start: {new Date(p.startDate).toLocaleDateString()}</p>
            <p>End: {new Date(p.endDate).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectsPreview