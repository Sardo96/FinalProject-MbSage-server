const { Schema, model } = require('mongoose');

const bookingSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  massage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Massage',
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  }
});

const Booking = model('Booking', bookingSchema);

module.exports = Booking;
