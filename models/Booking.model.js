const { Schema, model } = require("mongoose");

const bookingSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
          },
          dateTime: {
            type: Date,
            required: true
          },
          status: {
            type: String,
            default: 'Pending'
          }
    });

const Booking = model("Booking", bookingSchema);

module.exports = Booking;
