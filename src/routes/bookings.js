const express = require('express');
const { createBooking, getUserBookings, cancelBooking } = require('../controllers/bookingController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createBooking);
router.get('/my', getUserBookings);
router.patch('/:id/cancel', cancelBooking);

module.exports = router;