import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProjects, createProject, deleteProject, updateProject } from '../../services/projectService'
import CreateProjectModal from './CreateProjectModal'
import './ProjectList.css'
import { useAuth } from '../../context/AuthContext'

const ProjectList = () => {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const data = await getProjects()
      setProjects(data.projects)
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async (projectData) => {
    try {
      await createProject(projectData)
      setShowModal(false)
      loadProjects()
    } catch (error) {
      console.error('Error creating project:', error)
      throw error
    }
  }

  const handleUpdateProject = async (projectData) => {
    try {
      await updateProject(editingProject._id, projectData)
      setEditingProject(null)
      loadProjects()
    } catch (error) {
      console.error('Error updating project:', error)
      throw error
    }
  }

  const handleDeleteProject = async (projectId, projectName) => {
    if (window.confirm(`Are you sure you want to delete "${projectName}"? This will also delete all tasks.`)) {
      try {
        await deleteProject(projectId)
        loadProjects()
      } catch (error) {
        console.error('Error deleting project:', error)
        alert('Failed to delete project')
      }
    }
  }

  const handleEditProject = (project) => {
    setEditingProject(project)
  }

  if (loading) {
    return <div className="loading">Loading projects...</div>
  }

  return (
    <div className="container">
      <div className="projects-header">
        <h1>My Projects</h1>
        <button className="btn create-btn" onClick={() => setShowModal(true)}>
          + New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          <h2>No projects yet</h2>
          <p>Create your first project to get started!</p>
          <button className="btn" onClick={() => setShowModal(true)}>
            Create Project
          </button>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => {
            const isOwner = project.owner?._id === user._id

            return (
              <div
                key={project._id}
                className="project-card"
                style={{ borderLeft: `4px solid ${project.color}` }}
              >
                <Link to={`/project/${project._id}`} className="project-link">
                  <h3>{project.name}</h3>
                  <p>{project.description || 'No description'}</p>
                  <div className="project-meta">
                    <span>Owner: {project.owner.name}</span>
                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Members count dikhao */}
                  {project.members && project.members.length > 0 && (
                    <div className="project-members-count">
                      👥 {project.members.length} member{project.members.length > 1 ? 's' : ''}
                    </div>
                  )}
                </Link>

                {/* Edit/Delete buttons sirf owner ko dikhao */}
                {isOwner && (
                  <div className="project-actions">
                    <button
                      className="btn-action btn-edit"
                      onClick={() => handleEditProject(project)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => handleDeleteProject(project._id, project.name)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {showModal && (
        <CreateProjectModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreateProject}
        />
      )}

      {editingProject && (
        <CreateProjectModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onCreate={handleUpdateProject}
          isEditing={true}
        />
      )}
    </div>
  )
}

export default ProjectList