const express = require('express');
const router = express.Router();
const Job = require('../models/job');
const auth = require('../middleware/auth');

// GET all jobs for logged in user
router.get('/', auth, async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ADD a new job
router.post('/', auth, async (req, res) => {
  try {
    const { company, role, status, jobDescription, notes } = req.body;
    const job = new Job({
      user: req.user.id,
      company,
      role,
      status,
      jobDescription,
      notes
    });
    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE a job
router.put('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Make sure user owns the job
    if (job.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedJob);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE a job
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Make sure user owns the job
    if (job.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;