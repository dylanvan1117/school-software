//const http = require('node:http');

//const hostname = '127.0.0.1';
//const port = 3000;

//const server = http.createServer((req, res) => {
//  res.statusCode = 200;
//  res.setHeader('Content-Type', 'text/plain');
 // res.end('Hello, World!\n');
//});

//server.listen(port, hostname, () => {
//  console.log(`Server running at http://${hostname}:${port}/`);
//});

/***********************
 * server.js
 ***********************/
/* const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory "database" (for demo only)
let users = {}; 
// Example: users = {
//   "user1": { interests: ["space", "sports"], subjects: ["physics"], ... }
// }

// Sample question templates (could be much more complex in a real app)
const questionTemplates = {
  physics: [
    {
      template: "A {{interest}} player hits a ball with mass {{m}} kg at a velocity of {{v}} m/s. What is its kinetic energy?",
      formula: (m, v) => 0.5 * m * v * v, // K.E. = 1/2 m v^2
      subject: "physics"
    },
    {
      template: "You are an astronaut researching {{interest}}. A rock sample has a mass of {{m}} kg. On Mars, gravitational acceleration is ~3.71 m/s^2. How much does it weigh in newtons?",
      formula: (m) => 3.71 * m, // W = mg on Mars
      subject: "physics"
    }
  ],
  chemistry: [
    {
      template: "A {{interest}} chef is using vinegar (acetic acid) in a reaction. If the solution has a concentration of {{c}} M and volume {{v}} L, how many moles of acetic acid are present?",
      formula: (c, v) => c * v, // moles = concentration * volume
      subject: "chemistry"
    }
  ],
  calculus: [
    {
      template: "A {{interest}} function f(x) = x^2. Find the derivative f'(x).",
      formula: () => "2x", // derivative of x^2
      subject: "calculus"
    }
  ]
};

// Route 1: Sign up (or create a user)
app.post('/signup', (req, res) => {
  const { username, interests = [], subjects = [] } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Username is required.' });
  }

  // For simplicity, we won't check if the user already exists
  users[username] = {
    interests,
    subjects
  };

  return res.status(201).json({
    message: 'User created successfully',
    user: users[username]
  });
});

// Route 2: Generate a problem
app.post('/generate-problem', (req, res) => {
  const { username, subject } = req.body;

  // Check if user exists
  if (!users[username]) {
    return res.status(404).json({ error: 'User not found. Please sign up first.' });
  }

  // Check if we have templates for the requested subject
  if (!questionTemplates[subject]) {
    return res.status(400).json({ error: `No templates found for subject: ${subject}` });
  }

  // Grab user info
  const userInterests = users[username].interests;
  
  // Randomly pick one interest (if any exist)
  const randomInterest = userInterests.length
    ? userInterests[Math.floor(Math.random() * userInterests.length)]
    : 'general';

  // Randomly pick a template for the subject
  const templatesForSubject = questionTemplates[subject];
  const chosenTemplate = templatesForSubject[Math.floor(Math.random() * templatesForSubject.length)];

  // Generate random numeric values for the placeholders
  // (In a real app, you'd have logic to ensure appropriate difficulty, range, etc.)
  const m = (Math.random() * 5 + 1).toFixed(2); // mass
  const v = (Math.random() * 10 + 1).toFixed(2); // velocity
  const c = (Math.random() * 2 + 0.1).toFixed(2); // concentration
  const vol = (Math.random() * 2 + 0.5).toFixed(2); // volume

  // Construct the question text by replacing placeholders
  let questionText = chosenTemplate.template
    .replace('{{interest}}', randomInterest)
    .replace('{{m}}', m)
    .replace('{{v}}', v)
    .replace('{{c}}', c)
    .replace('{{v}}', vol); // careful if placeholders share the same token

  // For solution, call the formula function in a subject-appropriate way:
  let answer;
  if (chosenTemplate.subject === 'physics') {
    // Just as an example, let's see if the template uses velocity or not
    if (questionText.includes('kinetic energy')) {
      answer = chosenTemplate.formula(parseFloat(m), parseFloat(v));
    } else {
      answer = chosenTemplate.formula(parseFloat(m));
    }
  } else if (chosenTemplate.subject === 'chemistry') {
    answer = chosenTemplate.formula(parseFloat(c), parseFloat(vol));
  } else if (chosenTemplate.subject === 'calculus') {
    answer = chosenTemplate.formula();
  }

  // Send back the question and the correct answer (in a real system, you might hide the answer initially)
  return res.json({
    question: questionText,
    correctAnswer: answer
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 


// hi im dylan