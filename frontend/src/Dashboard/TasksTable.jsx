function TasksTable({ tasks, isAdmin }) {
  return (
    <div className='section'>
      <div className='section-header'>
        <h3>{isAdmin ? 'All Tasks' : 'My Tasks'}</h3>
      </div>

      <table className='tasks-table'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {tasks.length === 0 ? (
            <tr><td colSpan='3'>No tasks found</td></tr>
          ) : (
            tasks.slice(0, 5).map(t => (
              <tr key={t.id}>
                <td>{t.title}</td>
                <td>{t.description}</td>
                <td>
                  <span className={`status-badge ${t.status?.toLowerCase()}`}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default TasksTable