// testimonials.routes.js
const express = require('express');
const router = express.Router();
const testimonialsController = require('../controllers/testimonials.controller');

router.get('/testimonials', testimonialsController.getAllTestimonials);
router.get('/testimonials/random', testimonialsController.getRandomTestimonial);
router.get('/testimonials/:id', testimonialsController.getTestimonialById);
router.post('/testimonials/', testimonialsController.createTestimonial);
router.put('/testimonials/:id', testimonialsController.updateTestimonial);
router.delete('/testimonials/:id', testimonialsController.deleteTestimonial);

module.exports = router;