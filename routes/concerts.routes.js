// concerts.routes.js
const express = require('express');
const router = express.Router();
const concertsController = require('../controllers/concerts.controller');

router.get('/concerts', concertsController.getAllConcerts);
router.get('/concerts/:id', concertsController.getConcertById);
router.post('/concerts', concertsController.createConcert);
router.put('/concerts/:id', concertsController.updateConcert);
router.delete('/concerts/:id', concertsController.deleteConcert);

module.exports = router;