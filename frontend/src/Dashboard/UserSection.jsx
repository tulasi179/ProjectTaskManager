import StatsCards from './StatsCards'
import TasksTable from './TasksTable'

function UserSection({ user, tasks, notifications }) {
  return (
    <div className='dashboard-content'>
      <h2>Welcome, {user.username}! 👋</h2>
      <p className='role-badge'>{user.role}</p>

      <StatsCards
        tasks={tasks}
        notifications={notifications}
        isAdmin={false}
      />

      <TasksTable tasks={tasks} isAdmin={false} />
    </div>
  )
}

export default UserSection