const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countryController');

router.get('/countries', countryController.getCountriesWithFlags);
router.get('/country-info/:countryCode', countryController.getCountryInfo);

module.exports = router;
