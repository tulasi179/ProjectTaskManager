import { useState } from 'react'
import api from '../api/axios'

function TasksTable({ tasks, isAdmin, onStatusUpdate }) {
  const [updating, setUpdating] = useState(null) // tracks which task is updating

  const handleStatusUpdate = async (task) => {
    const nextStatus = task.status === 'Pending' ? 'InProgress' : 'Completed'
    setUpdating(task.id)
    try {
      await api.patch(`/task/${task.id}/status`, { status: nextStatus })
      if (onStatusUpdate) onStatusUpdate() // refresh tasks in parent
    } catch (err) {
      alert(err.response?.data || 'Could not update task status.')
    } finally {
      setUpdating(null)
    }
  }

  const getNextLabel = (status) => {
    if (status === 'Pending') return 'Start Task'
    if (status === 'InProgress') return 'Mark Complete'
    return null
  }

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
            {!isAdmin && <th>Action</th>}
          </tr>
        </thead>

        <tbody>
          {tasks.length === 0 ? (
            <tr><td colSpan={isAdmin ? 3 : 4}>No tasks found</td></tr>
          ) : (
            tasks.slice(0, 10).map(t => (
              <tr key={t.id}>
                <td>{t.title}</td>
                <td>{t.description}</td>
                <td>
                  <span className={`status-badge ${t.status?.toLowerCase()}`}>
                    {t.status}
                  </span>
                </td>
                {!isAdmin && (
                  <td>
                    {t.status !== 'Completed' ? (
                      <button
                        className={`status-btn ${t.status === 'Pending' ? 'start' : 'complete'}`}
                        onClick={() => handleStatusUpdate(t)}
                        disabled={updating === t.id}
                      >
                        {updating === t.id ? 'Updating...' : getNextLabel(t.status)}
                      </button>
                    ) : (
                      <span className='done-label'>✓ Done</span>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default TasksTable