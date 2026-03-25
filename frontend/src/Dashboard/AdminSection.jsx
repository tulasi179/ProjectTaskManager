import StatsCards from './StatsCards'
import ProjectsPreview from './ProjectsPreview'
import TasksTable from './TasksTable'

function AdminSection({ user, projects, tasks, notifications }) {
  return (
    <div className='dashboard-content'>
      <h2>Welcome, {user.username}! 👋</h2>
      <p className='role-badge'>{user.role}</p>

      <StatsCards
        tasks={tasks}
        notifications={notifications}
        projects={projects}
        isAdmin={true}
      />

      <ProjectsPreview projects={projects} />

      <TasksTable tasks={tasks} isAdmin={true} />
    </div>
  )
}

export default AdminSection