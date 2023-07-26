const router = require('express').Router();
const Booking = require('../models/Booking.model');
const mongoose = require('mongoose');

router.post('/bookings', async (req, res, next) => {
  const { massage, appointmentDate, name, phone } = req.body;

  try {
    const newBooking = await Booking.create({
      massage,
      appointmentDate,
      name,
      phone
    });

    res.json(newBooking);
  } catch (error) {
    console.log('An error occurred creating a new appointment', error);
    next(error);
  }
});

router.get('/bookings', async (req, res, next) => {
  try {
    const allBookings = await Booking.find();
    res.json(allBookings);
  } catch (error) {
    console.log('An error occurred getting all appointments', error);
    next(error);
  }
});

module.exports = router;
