import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProject, addMember, removeMember } from '../../services/projectService'
import { getTasks, createTask, updateTask, deleteTask } from '../../services/taskService'
import TaskCard from '../tasks/TaskCard'
import CreateTaskModal from '../tasks/CreateTaskModal'
import TaskModal from '../tasks/TaskModal'
import MembersModal from './MembersModal'
import './ProjectBoard.css'
import { connectSocket, getSocket } from '../../utils/socket'

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: '#6b778c' },
  { id: 'inprogress', title: 'In Progress', color: '#0079bf' },
  { id: 'review', title: 'Review', color: '#f2d600' },
  { id: 'done', title: 'Done', color: '#61bd4f' }
]

const ProjectBoard = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [showMembersModal, setShowMembersModal] = useState(false)

  useEffect(() => {
    loadData()
  }, [id])

  // 🔥 REAL-TIME SOCKET LISTENERS
  useEffect(() => {
    if (project) {
      const socket = connectSocket()

      // Join the specific project room
      socket.emit('join_project', project._id)
      console.log(`Joined room: project_${project._id}`)

      // Listen for Task Created
      socket.on('task_created', (newTask) => {
        console.log('Real-time: Task Created', newTask)
        setTasks((prevTasks) => [...prevTasks, newTask])
      })

      // Listen for Task Updated (e.g., moved to another column)
      socket.on('task_updated', (updatedTask) => {
        console.log('Real-time: Task Updated', updatedTask)
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t._id === updatedTask._id ? updatedTask : t))
        )
      })

      // Listen for Task Deleted
      socket.on('task_deleted', ({ taskId }) => {
        console.log('Real-time: Task Deleted', taskId)
        setTasks((prevTasks) => prevTasks.filter((t) => t._id !== taskId))
      })

      // Cleanup on unmount
      return () => {
        socket.emit('leave_project', project._id)
        socket.off('task_created')
        socket.off('task_updated')
        socket.off('task_deleted')
      }
    }
  }, [project])

  const loadData = async () => {
    try {
      const projectData = await getProject(id)
      setProject(projectData.project)
      setTasks(projectData.tasks)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (taskData) => {
    try {
      const response = await createTask({ ...taskData, project: id })
      setTasks([...tasks, response.task])
      setShowCreateModal(false)
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  }

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const response = await updateTask(taskId, updates)
      setTasks(tasks.map(t => t._id === taskId ? response.task : t))
      setSelectedTask(null)
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId)
      setTasks(tasks.filter(t => t._id !== taskId))
      setSelectedTask(null)
    } catch (error) {
      console.error('Error deleting task:', error)
      throw error
    }
  }

  const handleAddMember = async (userId) => {
    try {
      const response = await addMember(id, userId)
      // Full project data reload karo
      const projectData = await getProject(id)
      setProject(projectData.project)
      setShowMembersModal(false)
    } catch (error) {
      console.error('Error adding member:', error)
    }
  }

  const handleRemoveMember = async (userId) => {
    try {
      const response = await removeMember(id, userId)
      // Full project data reload karo
      const projectData = await getProject(id)
      setProject(projectData.project)
    } catch (error) {
      console.error('Error removing member:', error)
    }
  }

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status)
  }

  if (loading) {
    return <div className="loading">Loading project...</div>
  }

  if (!project) {
    return <div className="loading">Project not found</div>
  }

  return (
    <div className="board-page">
      <div className="board-header">
        <div className="board-title">
          <button className="back-btn" onClick={() => navigate('/')}>←</button>
          <h1>{project.name}</h1>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setShowMembersModal(true)}
            style={{ width: 'auto' }}
          >
            👥 Members ({(project.members?.length || 0) + 1})
          </button>
          <button
            className="btn"
            onClick={() => setShowCreateModal(true)}
            style={{ width: 'auto' }}
          >
            + Add Task
          </button>
        </div>
      </div>

      <div className="board-container">
        {COLUMNS.map((column) => {
          const columnTasks = getTasksByStatus(column.id)
          return (
            <div key={column.id} className="board-column">
              <div className="column-header" style={{ borderLeft: `4px solid ${column.color}` }}>
                <h3>{column.title}</h3>
                <span className="task-count">{columnTasks.length}</span>
              </div>
              <div className="column-tasks">
                {columnTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onClick={() => setSelectedTask(task)}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateTask}
        />
      )}

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
        />
      )}

      {showMembersModal && (
        <MembersModal
          project={project}
          onClose={() => setShowMembersModal(false)}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
        />
      )}
    </div>
  )
}

export default ProjectBoard