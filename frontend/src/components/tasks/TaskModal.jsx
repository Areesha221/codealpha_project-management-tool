import { useState, useEffect } from 'react'
import TaskComments from './TaskComments'
import './TaskModal.css'

const TaskModal = ({ task, onClose, onUpdate, onDelete }) => {
  const [editedTask, setEditedTask] = useState(task)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      await onUpdate(task._id, editedTask)
    } catch (error) {
      console.error('Error updating task:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setLoading(true)
      try {
        await onDelete(task._id)
      } catch (error) {
        console.error('Error deleting task:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="task-modal" onClick={(e) => e.stopPropagation()}>
        <div className="task-modal-header">
          <h2>Task Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="task-modal-body">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={editedTask.title}
              onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={editedTask.description || ''}
              onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select
                value={editedTask.status}
                onChange={(e) => setEditedTask({...editedTask, status: e.target.value})}
                className="form-select"
              >
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select
                value={editedTask.priority}
                onChange={(e) => setEditedTask({...editedTask, priority: e.target.value})}
                className="form-select"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              value={editedTask.dueDate ? editedTask.dueDate.split('T')[0] : ''}
              onChange={(e) => setEditedTask({...editedTask, dueDate: e.target.value})}
            />
          </div>

          <div className="task-actions">
            <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
              Delete
            </button>
            <div className="task-actions-right">
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button className="btn" onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>

        <TaskComments taskId={task._id} />
      </div>
    </div>
  )
}

export default TaskModal