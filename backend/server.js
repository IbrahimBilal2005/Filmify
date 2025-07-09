const express = require('express');
const app = express();
const PORT = 3000;

// Example route
app.get('/movies', (req, res) => {
  res.json([
    { id: 1, title: "Inception" },
    { id: 2, title: "Interstellar" },
    { id: 3, title: "The Matrix" }
  ]);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
