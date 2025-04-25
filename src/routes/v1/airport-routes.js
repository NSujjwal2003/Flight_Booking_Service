const express = require('express');

const { AirportController } = require('../../controllers');
const { AirportMiddlewares} = require('../../middlewares');
const router = express.Router();

// /api/v1/airplanes POST request
router.post('/', AirportMiddlewares.validateCreateRequest, AirportController.createAirport);

// /api/v1/airplanes GET requests
router.get('/', AirportController.getAirports);

// /api/v1/airplanes/:id GET request
router.get('/:id', AirportController.getAirport);

// /api/v1/airplanes/:id DELETE request
router.delete('/:id', AirportController.destroyAirport);

// /api/v1/airplanes/:id update request
router.patch('/:id', AirportController.updateAirports);
module.exports = router;

