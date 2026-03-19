const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const auth = require('../middleware/auth');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// AI Analyze Job Description
router.post('/analyze', auth, async (req, res) => {
  try {
    const { jobDescription, role } = req.body;

    if (!jobDescription) {
      return res.status(400).json({ message: 'Job description is required' });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: `You are a career coach helping someone prepare for a job application.
          
Role: ${role}
Job Description: ${jobDescription}

Please provide:
1. Top 5 key skills required for this role
2. Top 3 tips to prepare for the interview
3. One important thing to highlight in the resume

Keep it concise and practical.`
        }
      ]
    });

    const advice = completion.choices[0].message.content;
    res.json({ advice });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'AI service error' });
  }
});

module.exports = router;