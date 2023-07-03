const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  { firstName: {
      type: String,
      required: [true, 'Name is required']
    },
    lastName: {
      type: String,
      required: [true, 'Surname is required']
    },
    birthday: {
      type: Date,
      required: [true, 'Birthday is required']
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required.']
    },
    address: {
      type: String,
      required: [true, 'Address is required.']
    },
    medicalConditions: {
      type: String
    },
    allergies: {
      type: String
    },
    medications: {
      type: String
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
