const express = require('express');
const router = express.Router();
const db = require('./../db');

router.get('/', (req, res) => {
  res.json(db.seats);
});

router.get('/:id', (req, res) => {
  const seat = db.seats.find(item => item.id === parseInt(req.params.id));
  if (seat) {
    res.json(seat);
  } else {
    res.status(404).json({ message: 'Not found...' });
  }
});

router.post('/', (req, res) => {
  const { day, seat, client, email } = req.body;

  const isSeatTaken = db.seats.some(item => item.day === day && item.seat === seat);

  if (isSeatTaken) {
    return res.status(400).json({ message: 'The slot is already taken...' });
  }

  const newSeat = { id: db.seats.length + 1, day, seat, client, email };
  db.seats.push(newSeat);

  req.io.emit('seatsUpdated', db.seats);

  res.json({ message: 'OK' });
});

router.put('/:id', (req, res) => {
  const seatIndex = db.seats.findIndex(item => item.id === parseInt(req.params.id));
  if (seatIndex !== -1) {
    const { day, seat, client, email } = req.body;
    db.seats[seatIndex] = { id: parseInt(req.params.id), day, seat, client, email };
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Not found...' });
  }
});

router.delete('/:id', (req, res) => {
  const seatIndex = db.seats.findIndex(item => item.id === parseInt(req.params.id));
  if (seatIndex !== -1) {
    db.seats.splice(seatIndex, 1);
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Not found...' });
  }
});

module.exports = router;