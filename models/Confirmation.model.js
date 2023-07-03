const { Schema, model } = require("mongoose");

const confirmationSchema = new Schema(
    {
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking',
            required: true
          },
          emailSentAt: {
            type: Date,
            required: true
          },
          emailStatus: {
            type: String,
            required: true
          }
    });

const Confirmation = model("Confirmation", confirmationSchema);

module.exports = Confirmation;