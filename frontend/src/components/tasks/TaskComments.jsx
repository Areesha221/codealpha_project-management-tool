import { useState, useEffect } from 'react'
import { getComments, createComment } from '../../services/commentService'
import { useAuth } from '../../context/AuthContext'
import './TaskComments.css'

const TaskComments = ({ taskId }) => {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    loadComments()
  }, [taskId])

  const loadComments = async () => {
    try {
      const data = await getComments(taskId)
      setComments(data.comments)
    } catch (error) {
      console.error('Error loading comments:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setLoading(true)
    try {
      await createComment({ content: newComment, task: taskId })
      setNewComment('')
      loadComments()
    } catch (error) {
      console.error('Error creating comment:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="comments-section-modal">
      <h3>Comments ({comments.length})</h3>
      
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment._id} className="comment">
            <div className="comment-author">{comment.author.name}</div>
            <div className="comment-content">{comment.content}</div>
            <div className="comment-date">
              {new Date(comment.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          rows="2"
          disabled={loading}
        />
        <button type="submit" className="btn" disabled={loading || !newComment.trim()}>
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    </div>
  )
}

export default TaskComments