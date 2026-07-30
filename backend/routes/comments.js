const express = require('express');
const Comment = require('../models/Comment');
const Task = require('../models/Task');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

const router = express.Router();

// Get comments for a task
router.get('/task/:taskId', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId).populate('project');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.project._id);
    if (project.owner.toString() !== req.user._id.toString() &&
        !project.members.some(member => member.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const comments = await Comment.find({ task: req.params.taskId })
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json({ comments });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error fetching comments' });
  }
});

// Create comment
router.post('/', auth, async (req, res) => {
  try {
    const { content, task } = req.body;

    const taskDoc = await Task.findById(task).populate('project');
    if (!taskDoc) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(taskDoc.project._id);
    if (project.owner.toString() !== req.user._id.toString() &&
        !project.members.some(member => member.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const comment = new Comment({
      content,
      task,
      author: req.user._id
    });

    await comment.save();
    await comment.populate('author', 'name email avatar');

    // Emit socket event
    const io = req.app.get('io');
    io.to(`project_${project._id}`).emit('comment_created', comment);

    res.status(201).json({ message: 'Comment created successfully', comment });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Server error creating comment' });
  }
});

// Update comment
router.put('/:id', auth, async (req, res) => {
  try {
    const { content } = req.body;

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only comment author can update' });
    }

    comment.content = content;
    await comment.save();
    await comment.populate('author', 'name email avatar');

    res.json({ message: 'Comment updated successfully', comment });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ message: 'Server error updating comment' });
  }
});

// Delete comment
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate('task');
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only comment author can delete' });
    }

    const task = await Task.findById(comment.task._id).populate('project');
    const project = await Project.findById(task.project._id);

    await comment.deleteOne();

    // Emit socket event
    const io = req.app.get('io');
    io.to(`project_${project._id}`).emit('comment_deleted', { commentId: req.params.id });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error deleting comment' });
  }
});

module.exports = router;