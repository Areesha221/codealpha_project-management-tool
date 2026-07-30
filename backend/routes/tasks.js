const express = require('express');
const Task = require('../models/Task');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

const router = express.Router();

// Get tasks for a project
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user._id.toString() &&
      !project.members.some(member => member.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort({ position: 1 });

    res.json({ tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
});

// Create task
// Create task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, project, assignedTo, status, priority, dueDate, labels } = req.body;

    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const lastTask = await Task.findOne({ project }).sort({ position: -1 });
    const position = lastTask ? lastTask.position + 1 : 0;

    const task = new Task({
      title, description, project, assignedTo, createdBy: req.user._id,
      status, priority, dueDate, labels, position
    });

    await task.save();
    await task.populate('assignedTo', 'name email avatar');
    await task.populate('createdBy', 'name email avatar');

    // 🔥 REAL-TIME: Emit event to project room
    const io = req.app.get('io');
    io.to(`project_${project}`).emit('task_created', task);

    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error creating task' });
  }
});

// Update task
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, assignedTo, status, priority, dueDate, labels, position } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findById(task.project);
    if (project.owner.toString() !== req.user._id.toString() &&
        !project.members.some(member => member.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.assignedTo = assignedTo !== undefined ? assignedTo : task.assignedTo;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;
    task.labels = labels || task.labels;
    task.position = position !== undefined ? position : task.position;

    await task.save();
    await task.populate('assignedTo', 'name email avatar');
    await task.populate('createdBy', 'name email avatar');

    // 🔥 REAL-TIME: Emit event to project room
    const io = req.app.get('io');
    io.to(`project_${task.project}`).emit('task_updated', task);

    res.json({ message: 'Task updated successfully', task });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error updating task' });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findById(task.project);
    if (project.owner.toString() !== req.user._id.toString() &&
        !project.members.some(member => member.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const projectId = task.project; // Save before deleting
    await task.deleteOne();

    // 🔥 REAL-TIME: Emit event to project room
    const io = req.app.get('io');
    io.to(`project_${projectId}`).emit('task_deleted', { taskId: req.params.id });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error deleting task' });
  }
});

module.exports = router;