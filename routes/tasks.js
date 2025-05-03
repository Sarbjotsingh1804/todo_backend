const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.render('index', { tasks });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Add new task
router.post('/', async (req, res) => {
  if (!req.body.title) {
    return res.redirect('/');
  }
  
  try {
    const newTask = new Task({
      title: req.body.title,
      priority: req.body.priority || 'low'
    });
    await newTask.save();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Edit task form
router.get('/edit/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.redirect('/');
    }
    res.render('edit', { task });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// Update task
router.post('/edit/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.redirect('/');
    }
    
    task.title = req.body.title;
    task.priority = req.body.priority;
    await task.save();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// Delete task
router.post('/delete/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

module.exports = router;