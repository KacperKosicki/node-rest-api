const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose'); // Dodaj import Mongoose

// routes
const testimonialsRoutes = require('./routes/testimonials.routes');
const concertsRoutes = require('./routes/concerts.routes');
const seatsRoutes = require('./routes/seats.routes');

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

// Połączenie z bazą danych
mongoose.connect('mongodb+srv://kosickikacper1:1OaQvJk7zFG57Nfm@cluster0.b2vomcn.mongodb.net/NewWaveDB?retryWrites=true&w=majority', {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to the database');
  // Połączenie z bazą danych - tutaj możesz umieścić dodatkowe konfiguracje związane z bazą danych, jeśli są potrzebne
});

// Stworzenie serwera HTTP
const server = http.createServer(app);

// Dodaj nowy middleware
const io = socketIO(server); // Inicjalizacja Socket.IO z użyciem serwera HTTP

app.use((req, res, next) => {
  req.io = io; // Dodaj referencję do obiektu io do obiektu req
  next();
});

app.use('/api', testimonialsRoutes);
app.use('/api', concertsRoutes);
app.use('/api', seatsRoutes);

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