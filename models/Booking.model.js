const { Schema, model } = require('mongoose');

const bookingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  massageId: {
    type: Schema.Types.ObjectId,
    ref: 'Massage',
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'cancelled', 'finished'],
    default: 'pending'
  },
  phone: {
    type: String,
    required: true
  }
});

const Booking = model('Booking', bookingSchema);

module.exports = Booking;
