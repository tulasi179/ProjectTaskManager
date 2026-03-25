function StatsCards({ tasks, notifications, projects = [], isAdmin }) {
  const pending = tasks.filter(t => t.status === 'Pending')
  const inProgress = tasks.filter(t => t.status === 'InProgress')
  const completed = tasks.filter(t => t.status === 'Completed')
  const unread = notifications.filter(n => !n.readStatus)

  return (
    <div className='stats-grid'>
      {isAdmin && (
        <div className='stat-card'>
          <h3>{projects.length}</h3>
          <p>Total Projects</p>
        </div>
      )}

      <div className='stat-card pending'>
        <h3>{pending.length}</h3>
        <p>Pending Tasks</p>
      </div>

      <div className='stat-card inprogress'>
        <h3>{inProgress.length}</h3>
        <p>In Progress</p>
      </div>

      <div className='stat-card completed'>
        <h3>{completed.length}</h3>
        <p>Completed</p>
      </div>

      <div className='stat-card notif'>
        <h3>{unread.length}</h3>
        <p>Unread Notifications</p>
      </div>
    </div>
  )
}

export default StatsCards