const { Schema, model } = require('mongoose');

const reviewSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  comment: {
    type: String,
    required: true
  }
});

const Review = model('Review', reviewSchema);

module.exports = Review;
