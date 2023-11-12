const express = require('express');
const cors = require('cors');
const path = require('path'); // Dodaj import path

const testimonialsRoutes = require('./routes/testimonials.routes');
const concertsRoutes = require('./routes/concerts.routes');
const seatsRoutes = require('./routes/seats.routes');

const app = express();
const port = process.env.PORT || 8000; // Użyj zmiennej środowiskowej dla portu

app.use(express.json());
app.use(cors());

app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/concerts', concertsRoutes);
app.use('/api/seats', seatsRoutes);

// Obsługa ścieżek dla aplikacji React
app.use(express.static(path.join(__dirname, '/client/build')));

// Endpoint dla dowolnej niepasującej ścieżki
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});