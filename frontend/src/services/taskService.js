import api from './api'

export const getTasks = async (projectId) => {
  const response = await api.get(`/tasks/project/${projectId}`)
  return response.data
}

export const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData)
  return response.data
}

export const updateTask = async (id, taskData) => {
  const response = await api.put(`/tasks/${id}`, taskData)
  return response.data
}

export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`)
  return response.data
}