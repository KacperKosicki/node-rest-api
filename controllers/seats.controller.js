const Seat = require('../models/seats.model');

exports.getAllSeats = async (req, res) => {
  try {
    const seats = await Seat.find();
    res.json(seats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRandomSeat = async (req, res) => {
  try {
    const count = await Seat.countDocuments();
    if (count === 0) {
      res.status(404).json({ message: 'Not found...' });
    } else {
      const randomIndex = Math.floor(Math.random() * count);
      const randomSeat = await Seat.findOne().skip(randomIndex);
      res.json(randomSeat);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSeatById = async (req, res) => {
  try {
    const seat = await Seat.findOne({ id: parseInt(req.params.id) });
    if (seat) {
      res.json(seat);
    } else {
      res.status(404).json({ message: 'Not found...' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createSeat = async (req, res) => {
  const { day, seat, client, email } = req.body;

  try {
    const isSeatTaken = await Seat.exists({ day, seat });
    if (isSeatTaken) {
      return res.status(400).json({ message: 'The slot is already taken...' });
    }

    const newSeat = new Seat({ day, seat, client, email });
    await newSeat.save();

    req.io.emit('seatsUpdated', newSeat);

    res.json({ message: 'OK' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateSeat = async (req, res) => {
  try {
    const updatedSeat = await Seat.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedSeat);
  } catch (err) {
    res.status(404).json({ message: 'Not found...' });
  }
};

exports.deleteSeat = async (req, res) => {
  try {
    await Seat.findByIdAndDelete(req.params.id);
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(404).json({ message: 'Not found...' });
  }
};