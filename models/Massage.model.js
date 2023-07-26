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
    // required: true
  },
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  averageRating: {
    type: Number,
    default: 0
  },
  totalRating: {
    type: Number,
    default: 0
  },
  isApproved: {
    type: String,
    enum: ['pending', 'approved', 'cancelled'],
    default: 'pending'
  }
});

const Massage = model('Massage', massageSchema);

module.exports = Massage;
