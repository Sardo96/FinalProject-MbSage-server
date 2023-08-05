const { Schema, model } = require('mongoose');

const massageSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String
  },
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  averageRating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  totalRating: {
    type: Number,
    default: 0
  }
});

const Massage = model('Massage', massageSchema);

module.exports = Massage;
