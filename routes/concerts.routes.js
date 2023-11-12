// concerts.routes.js
const express = require('express');
const router = express.Router();
const db = require('./../db');

router.get('/', (req, res) => {
  res.json(db.concerts);
});

router.get('/:id', (req, res) => {
  const concert = db.concerts.find(item => item.id === parseInt(req.params.id));
  if (concert) {
    res.json(concert);
  } else {
    res.status(404).json({ message: 'Not found...' });
  }
});

router.post('/', (req, res) => {
  const { performer, genre, price, day, image } = req.body;
  const newConcert = { id: db.concerts.length + 1, performer, genre, price, day, image };
  db.concerts.push(newConcert);
  res.json({ message: 'OK' });
});

router.put('/:id', (req, res) => {
  const concertIndex = db.concerts.findIndex(item => item.id === parseInt(req.params.id));
  if (concertIndex !== -1) {
    const { performer, genre, price, day, image } = req.body;
    db.concerts[concertIndex] = { id: parseInt(req.params.id), performer, genre, price, day, image };
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Not found...' });
  }
});

router.delete('/:id', (req, res) => {
  const concertIndex = db.concerts.findIndex(item => item.id === parseInt(req.params.id));
  if (concertIndex !== -1) {
    db.concerts.splice(concertIndex, 1);
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Not found...' });
  }
});

module.exports = router;