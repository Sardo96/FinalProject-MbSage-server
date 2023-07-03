const { Schema, model } = require("mongoose");

const massageSchema = new Schema(
    {
        name: {
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
            type: String,
            required: true
          }
    });

const Massage = model("Massage", massageSchema);

module.exports = Massage;

