const router = require('express').Router();
const Booking = require('../models/Booking.model');
const Massage = require('../models/Massage.model');
const mongoose = require('mongoose');
const { isAuthenticated } = require('../middleware/jwt.middleware');
const { isAdmin } = require('../middleware/admin.middleware');

router.post('/bookings', isAuthenticated, async (req, res, next) => {
  const { appointmentDate, name, phone } = req.body;
  const userId = req.payload._id;

  try {
    const massageId = req.body.massageId;
    const massage = await Massage.findById(massageId);
    if (!massage) {
      return res.status(404).json({ message: 'No massage found with that id' });
    }
    const massageDuration = massage.duration;

    let endTime = new Date(appointmentDate);
    endTime.setMinutes(endTime.getMinutes() + massageDuration);

    const newBooking = await Booking.create({
      userId,
      massageId,
      appointmentDate,
      endTime,
      name,
      phone
    });

    res.json(newBooking);
  } catch (error) {
    console.log('An error occurred creating a new appointment', error);
    next(error);
  }
});

router.get('/bookings', isAdmin, async (req, res, next) => {
  try {
    const allBookings = await Booking.find();
    res.json(allBookings);
  } catch (error) {
    console.log('An error occurred getting all appointments', error);
    next(error);
  }
});

// router.get(
//   '/bookings/date/:selectedDate',
//   isAuthenticated,
//   async (req, res, next) => {
//     const { selectedDate } = req.params;

//     try {
//       const date = new Date(selectedDate);
//       if (isNaN(date.getTime())) {
//         return res.status(400).json({ message: 'Invalid date format' });
//       }

//       const nextDay = new Date(date);
//       nextDay.setDate(nextDay.getDate() + 1);

//       const bookings = await Booking.find({
//         appointmentDate: { $gte: date, $lt: nextDay }
//       });

//       res.json(bookings);
//     } catch (error) {
//       console.log(
//         'An error occurred getting all appointments for a date',
//         error
//       );
//       next(error);
//     }
//   }
// );

router.get('/bookings/:id', isAuthenticated, async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Specified id is not valid' });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: 'No booking found with that id' });
    }

    res.json(booking);
  } catch (error) {
    console.log('An error occurred getting the booking', error);
    next(error);
  }
});

router.put('/bookings/:id', async (req, res, next) => {
  const { id } = req.params;
  const { appointmentDate, name, phone, status } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Specified id is not valid' });
    }

    // Retrieve the original booking from the database
    const originalBooking = await Booking.findById(id);
    if (!originalBooking) {
      return res
        .status(404)
        .json({ message: 'No booking found with specified id' });
    }

    // Calculate endTime using the massage duration and the new appointmentDate
    const massageId = originalBooking.massageId;
    const massage = await Massage.findById(massageId);
    if (!massage) {
      return res.status(404).json({ message: 'No massage found with that id' });
    }

    const massageDuration = massage.duration;
    let endTime = new Date(appointmentDate);
    endTime.setMinutes(endTime.getMinutes() + massageDuration);

    // Update the booking with the new values, including endTime and appointmentDate
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      {
        appointmentDate,
        endTime,
        name,
        phone,
        status
      },
      { new: true }
    );

    if (!updatedBooking) {
      return res
        .status(404)
        .json({ message: 'No booking found with specified id' });
    }

    res.json(updatedBooking);
  } catch (error) {
    console.log('An error occurred updating the booking', error);
    next(error);
  }
});

router.delete('/bookings/:id', isAdmin, async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Specified id is not valid' });
    }

    await Booking.findByIdAndDelete(id);
    res.json({
      message: `Booking with id ${id} has been deleted successfully`
    });
  } catch (error) {
    console.log('An error occurred deleting the booking', error);
    next(error);
  }
});

module.exports = router;
