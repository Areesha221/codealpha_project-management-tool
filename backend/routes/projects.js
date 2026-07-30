const express = require('express');
const Project = require('../models/Project');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all projects for user
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user._id },
        { members: req.user._id }
      ]
    }).populate('owner', 'name email avatar').populate('members', 'name email avatar');

    res.json({ projects });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error fetching projects' });
  }
});

// Get single project
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user has access
    if (project.owner._id.toString() !== req.user._id.toString() &&
        !project.members.some(member => member._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Access denied to this project' });
    }

    const tasks = await Task.find({ project: project._id })
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort({ position: 1 });

    res.json({ project, tasks });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error fetching project' });
  }
});

// Create project
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, color } = req.body;

    const project = new Project({
      name,
      description,
      color,
      owner: req.user._id,
      members: [req.user._id]
    });

    await project.save();
    await project.populate('owner', 'name email avatar');
    await project.populate('members', 'name email avatar');

    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error creating project' });
  }
});

// Update project
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, color } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only project owner can update' });
    }

    project.name = name || project.name;
    project.description = description || project.description;
    project.color = color || project.color;

    await project.save();
    await project.populate('owner', 'name email avatar');
    await project.populate('members', 'name email avatar');

    res.json({ message: 'Project updated successfully', project });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error updating project' });
  }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only project owner can delete' });
    }

    await Task.deleteMany({ project: project._id });
    await project.deleteOne();

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error deleting project' });
  }
});

// Add member to project
router.post('/:id/members', auth, async (req, res) => {
  try {
    const { userId } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only project owner can add members' });
    }

    if (project.members.includes(userId)) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    project.members.push(userId);
    await project.save();
    await project.populate('members', 'name email avatar');

    res.json({ message: 'Member added successfully', project });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ message: 'Server error adding member' });
  }
});

// Remove member from project
router.delete('/:id/members/:userId', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only project owner can remove members' });
    }

    project.members = project.members.filter(
      member => member.toString() !== req.params.userId
    );
    await project.save();
    await project.populate('members', 'name email avatar');

    res.json({ message: 'Member removed successfully', project });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ message: 'Server error removing member' });
  }
});

module.exports = router;