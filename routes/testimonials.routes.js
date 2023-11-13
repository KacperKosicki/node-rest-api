// testimonials.routes.js
const express = require('express');
const router = express.Router();
const db = require('./../db');

router.get('/', (req, res) => {
  res.json(db.testimonials);
});

router.get('/random', (req, res) => {
  if (db.testimonials.length === 0) {
    res.status(404).json({ message: 'Not found...1' });
  } else {
    const randomIndex = Math.floor(Math.random() * db.testimonials.length);
    const randomTestimonial = db.testimonials[randomIndex];
    res.json(randomTestimonial);
  }
});

router.get('/:id', (req, res) => {
  const testimonial = db.testimonials.find(item => item.id === parseInt(req.params.id));
  if (testimonial) {
    res.json(testimonial);
  } else {
    res.status(404).json({ message: 'Not found...' });
  }
});

router.post('/', (req, res) => {
  const { author, text } = req.body;
  const newTestimonial = { id: db.testimonials.length + 1, author, text };
  db.testimonials.push(newTestimonial);
  res.json({ message: 'OK' });
});

router.put('/:id', (req, res) => {
  const testimonialIndex = db.testimonials.findIndex(item => item.id === parseInt(req.params.id));
  if (testimonialIndex !== -1) {
    const { author, text } = req.body;
    db.testimonials[testimonialIndex] = { id: parseInt(req.params.id), author, text };
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Not found...' });
  }
});

router.delete('/:id', (req, res) => {
  const testimonialIndex = db.testimonials.findIndex(item => item.id === parseInt(req.params.id));
  if (testimonialIndex !== -1) {
    db.testimonials.splice(testimonialIndex, 1);
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Not found...' });
  }
});

module.exports = router;