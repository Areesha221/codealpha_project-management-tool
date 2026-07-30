import './TaskCard.css'

const priorityColors = {
  low: '#61bd4f',
  medium: '#f2d600',
  high: '#ff9f1a',
  urgent: '#eb5a46'
}

const TaskCard = ({ task, onClick }) => {
  return (
    <div className="task-card" onClick={onClick}>
      <div className="task-title">{task.title}</div>
      {task.description && (
        <div className="task-description">{task.description}</div>
      )}
      <div className="task-meta">
        {task.assignedTo && (
          <div className="task-assignee">
             {task.assignedTo.name}
          </div>
        )}
        <div 
          className="priority-badge"
          style={{ backgroundColor: priorityColors[task.priority] }}
        >
          {task.priority}
        </div>
      </div>
    </div>
  )
}

export default TaskCard