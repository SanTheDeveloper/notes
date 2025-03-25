require("dotenv").config();
// Import the Express.js framework
const express = require("express");
// Create an Express application instance
const app = express();
// const cors = require("cors");

// Initialize an array of note objects with some sample data
let notes = [
  {
    id: "1", // Unique identifier for the note
    content: "HTML is easy", // Text content of the note
    important: true, // Boolean flag indicating importance
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

// Middleware function to log request details
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method); // Log HTTP method (GET, POST, etc.)
  console.log("Path:  ", request.path); // Log requested URL path
  console.log("Body:  ", request.body); // Log request body content
  console.log("---"); // Separator for readability
  next(); // Pass control to the next middleware
};

// Serve static files from the "dist" directory
app.use(express.static("dist"));

/* // Enable CORS for all routes
app.use(cors()); */

// Enable JSON parsing for request bodies
app.use(express.json());
// Apply the request logging middleware to all routes
app.use(requestLogger);

// Root route handler
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>"); // Send simple HTML response
});

// Route to get all notes
app.get("/api/notes", (request, response) => {
  response.json(notes); // Send notes array as JSON response
});

// Route to get a specific note by ID
app.get("/api/notes/:id", (request, response) => {
  const id = request.params.id; // Extract ID from URL parameter
  const note = notes.find((note) => note.id === id); // Find matching note

  if (note) {
    response.json(note); // Send found note as JSON
  } else {
    response.status(404).end(); // Return 404 if note not found
  }
});

// Function to generate a new unique ID for notes
const generateId = () => {
  // Find maximum existing ID and convert to number, or use 0 if array is empty
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((n) => Number(n.id))) : 0;
  return String(maxId + 1); // Return next ID as string
};

// Route to create a new note
app.post("/api/notes", (request, response) => {
  const body = request.body; // Get data from request body

  // Check if content is missing
  if (!body.content) {
    return response.status(400).json({
      error: "content missing", // Return error if no content provided
    });
  }

  // Create new note object
  const note = {
    content: body.content, // Use provided content
    important: body.important || false, // Use provided importance or default to false
    id: generateId(), // Generate new unique ID
  };

  notes = notes.concat(note); // Add new note to array
  response.json(note); // Send created note as response
});

// Route to delete a note by ID
app.delete("/api/notes/:id", (request, response) => {
  const id = request.params.id; // Get ID from URL parameter
  notes = notes.filter((note) => note.id !== id); // Remove note with matching ID

  response.status(204).end(); // Return 204 No Content status
});

// Middleware for handling unknown endpoints
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" }); // Return 404 for undefined routes
};

// Apply unknown endpoint handler for unmatched routes
app.use(unknownEndpoint);

// Define the port number for the server
const PORT = process.env.PORT || 3001;
// Start the server and log confirmation
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
