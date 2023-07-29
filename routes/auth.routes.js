const router = require('express').Router();
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isAuthenticated } = require('../middleware/jwt.middleware');
const fileUploader = require('../config/cloudinary.config');

const saltRounds = 10;

router.post('/signup', async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    birthday,
    phone,
    gender,
    photo,
    role,
    allergies
  } = req.body;

  console.log('Received photo:', photo);

  try {
    if (
      firstName === '' ||
      lastName === '' ||
      email === '' ||
      password === '' ||
      birthday === '' ||
      phone === '' ||
      gender === ''
    ) {
      return res.status(400).json({ message: 'Fill the mandatory fields' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Provide a valid email address' });
    }

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          'Password must have at least 6 characters and contain one number, one lowercase and one uppercase letter'
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res
        .status(400)
        .json({ message: 'The provided email is already registered' });
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = await User.create({
      firstName,
      lastName,
      birthday,
      email,
      password: hashedPassword,
      phone,
      gender,
      photo,
      role,
      allergies
    });

    res.json({
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      birthday: newUser.birthday,
      email: newUser.email,
      _id: newUser._id,
      phone: newUser.phone,
      gender: newUser.gender,
      photo: newUser.photo,
      role: newUser.role,
      allergies: newUser.allergies
    });
  } catch (error) {
    console.log('An error occurred creating the user', error);
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (email === '' || password === '') {
      return res.status(400).json({ message: 'All fields are mandatory' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: 'Provided email is not registered' });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    if (isPasswordCorrect) {
      const payload = {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      };

      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: 'HS256',
        expiresIn: '1H'
      });

      res.json({ authToken });
    } else {
      res.status(400).json({ message: 'Incorrect password' });
    }
  } catch (error) {
    console.log('An error occurred login in the user', error);
    next(error);
  }
});

router.get('/verify', isAuthenticated, (req, res, next) => {
  console.log('req.payload', req.payload);

  res.json(req.payload);
});

module.exports = router;
