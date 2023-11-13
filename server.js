const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const testimonialsRoutes = require('./routes/testimonials.routes');
const concertsRoutes = require('./routes/concerts.routes');
const seatsRoutes = require('./routes/seats.routes');

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

// Stworzenie serwera HTTP
const server = http.createServer(app);

// Dodaj nowy middleware
const io = socketIO(server); // Inicjalizacja Socket.IO z użyciem serwera HTTP

app.use((req, res, next) => {
  req.io = io; // Dodaj referencję do obiektu io do obiektu req
  next();
});

app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/concerts', concertsRoutes);
app.use('/api/seats', seatsRoutes);

app.use(express.static(path.join(__dirname, '/client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

io.on('connection', (socket) => {
  console.log('New socket!');
});