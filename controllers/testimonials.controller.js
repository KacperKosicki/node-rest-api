const Testimonial = require('../models/testimonials.model');

exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRandomTestimonial = async (req, res) => {
  try {
    const count = await Testimonial.countDocuments();
    if (count === 0) {
      res.status(404).json({ message: 'Not found...' });
    } else {
      const randomIndex = Math.floor(Math.random() * count);
      const randomTestimonial = await Testimonial.findOne().skip(randomIndex);
      res.json(randomTestimonial);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findOne({ id: parseInt(req.params.id) });
    if (testimonial) {
      res.json(testimonial);
    } else {
      res.status(404).json({ message: 'Not found...' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTestimonial = async (req, res) => {
  const { author, text } = req.body;

  try {
    const newTestimonial = new Testimonial({ author, text });
    await newTestimonial.save();

    res.json({ message: 'OK' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateTestimonial = async (req, res) => {
  try {
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTestimonial);
  } catch (err) {
    res.status(404).json({ message: 'Not found...' });
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(404).json({ message: 'Not found...' });
  }
};