import api from './api'

export const getComments = async (taskId) => {
  const response = await api.get(`/comments/task/${taskId}`)
  return response.data
}

export const createComment = async (commentData) => {
  const response = await api.post('/comments', commentData)
  return response.data
}

export const updateComment = async (id, commentData) => {
  const response = await api.put(`/comments/${id}`, commentData)
  return response.data
}

export const deleteComment = async (id) => {
  const response = await api.delete(`/comments/${id}`)
  return response.data
}