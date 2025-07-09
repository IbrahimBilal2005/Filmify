const express = require('express');
const app = express();
const PORT = 3000;

const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

app.use(express.json());

app.get('/movies', async (req, res) => {
  try {
    const movies = await prisma.movie.findMany();
    res.json(movies);
  } catch (error) {
    console.error('GET /movies error:', error);
    res.status(500).json({ error: 'Something went wrong', details: error.message });
  }
});


app.post('/movies', async (req, res) => {
  const { title, genre } = req.body;

  try {
    const newMovie = await prisma.movie.create({
      data: {
        title,
        genre
      }
    });

    res.status(201).json(newMovie);
  } catch (error) {
    console.error('POST /movies error:', error);
    res.status(500).json({ error: 'Something went wrong', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
