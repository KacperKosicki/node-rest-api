const Concert = require('../models/concerts.model');

exports.getAllConcerts = async (req, res) => {
  try {
    const concerts = await Concert.find();
    res.json(concerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRandomConcert = async (req, res) => {
  try {
    const count = await Concert.countDocuments();
    if (count === 0) {
      res.status(404).json({ message: 'Not found...' });
    } else {
      const randomIndex = Math.floor(Math.random() * count);
      const randomConcert = await Concert.findOne().skip(randomIndex);
      res.json(randomConcert);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getConcertById = async (req, res) => {
  try {
    const concert = await Concert.findOne({ id: parseInt(req.params.id) });
    if (concert) {
      res.json(concert);
    } else {
      res.status(404).json({ message: 'Not found...' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createConcert = async (req, res) => {
  const concert = new Concert(req.body);

  try {
    const newConcert = await concert.save();
    res.status(201).json(newConcert);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateConcert = async (req, res) => {
  try {
    const updatedConcert = await Concert.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedConcert);
  } catch (err) {
    res.status(404).json({ message: 'Not found...' });
  }
};

exports.deleteConcert = async (req, res) => {
  try {
    await Concert.findByIdAndDelete(req.params.id);
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(404).json({ message: 'Not found...' });
  }
};