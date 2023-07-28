const router = require('express').Router();
const User = require('../models/User.model');
const { isAuthenticated } = require('../middleware/jwt.middleware');
const fileUploader = require('../config/cloudinary.config');

router.get('/profile', isAuthenticated, async (req, res, next) => {
  try {
    const user = await User.findById(req.payload._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      birthday: user.birthday,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      photo: user.photo,
      allergies: user.allergies
    });
  } catch (error) {
    console.log('An error occurred fetching the user profile', error);
    next(error);
  }
});

router.put(
  '/profile',
  isAuthenticated,
  fileUploader.single('photo'),
  async (req, res, next) => {
    const { phone, gender, photo, allergies } = req.body;

    try {
      let user = await User.findById(req.payload._id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.phone = phone;
      user.gender = gender;
      user.photo = photo;
      user.allergies = allergies;

      user = await user.save();

      res.json({
        firstName: user.firstName,
        lastName: user.lastName,
        birthday: user.birthday,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        photo: user.photo,
        allergies: user.allergies
      });
    } catch (error) {
      console.log('An error occurred updating the user profile', error);
      next(error);
    }
  }
);

module.exports = router;
