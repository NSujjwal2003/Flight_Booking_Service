const express = require('express');

const { CityController } = require('../../controllers');
// const  {CityMiddlewares} = require('../../middlewares');
const { validateCreateRequest } = require('../../middlewares/city-middlewares');
const router = express.Router();

// /api/v1/airplanes POST request

router.post('/', validateCreateRequest, CityController.createCity);


// /api/v1/airplanes/:id DELETE request
router.delete('/:id', CityController.destroyCity);


// /api/v1/airplanes/:id update request
router.patch('/:id', CityController.updateCity);

module.exports = router;
