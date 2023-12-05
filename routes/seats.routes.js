// seats.routes.js
const express = require('express');
const router = express.Router();
const seatsController = require('../controllers/seats.controller');

router.get('/seats', seatsController.getAllSeats);
router.get('/seats/:id', seatsController.getSeatById);
router.post('/seats', seatsController.createSeat);
router.put('/seats/:id', seatsController.updateSeat);
router.delete('/seats/:id', seatsController.deleteSeat);

module.exports = router;