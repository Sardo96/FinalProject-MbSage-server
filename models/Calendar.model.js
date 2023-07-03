const { Schema, model } = require("mongoose");

const calendarSchema = new Schema(
    {
        date: {
            type: Date,
            required: true
          },
          timeSlot: {
            type: String,
            required: true
          },
          isBooked: {
            type: Boolean,
            default: false
          },
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
          }
    });

const Calendar = model("Calendar", calendarSchema);

module.exports = Calendar;