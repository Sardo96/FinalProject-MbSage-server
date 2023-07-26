const { Schema, model } = require('mongoose');

const reviewSchema = new Schema(
  {
    massage: {
      type: Schema.Types.ObjectId,
      ref: 'Massage'
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewText: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0
    }
  },
  { timestamps: true }
);

const Review = model('Review', reviewSchema);

module.exports = Review;
