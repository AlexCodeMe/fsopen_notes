const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const PORT = 3001;

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
];

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

// Get all notes
app.get('/api/notes', (request, response) => {
  response.json(notes);
});

// Get a single note by ID
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find(note => note.id === id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end(); // Note not found
  }
});

// Add a new note
app.post('/api/notes', (request, response) => {
  const body = request.body;
  if (!body.content) {
    return response.status(400).json({ error: 'Content is missing' });
  }
  const note = {
    id: Math.max(...notes.map(note => note.id)) + 1,
    content: body.content,
    important: Boolean(body.important) || false
  };
  notes = notes.concat(note);
  response.json(note);
});

// Update a note by ID
app.put('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  const body = request.body;
  const noteIndex = notes.findIndex(note => note.id === id);
  if (noteIndex !== -1) {
    notes[noteIndex] = {
      ...notes[noteIndex],
      content: body.content || notes[noteIndex].content,
      important: body.hasOwnProperty('important') ? Boolean(body.important) : notes[noteIndex].important
    };
    response.json(notes[noteIndex]);
  } else {
    response.status(404).json({ error: 'Note not found' });
  }
})

// Delete a note by ID
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter(note => note.id !== id);
  response.status(204).end(); // No content
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
