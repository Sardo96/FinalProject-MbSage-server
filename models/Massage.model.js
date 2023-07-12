const { Schema, model } = require('mongoose');

const massageSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  image: {
    type: String
    // required: true
  }
});

const Massage = model('Massage', massageSchema);

module.exports = Massage;
