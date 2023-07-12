const router = require('express').Router();
const Massage = require('../models/Massage.model');
const mongoose = require('mongoose');
const fileUploader = require('../config/cloudinary.config');

router.post('/massages', async (req, res, next) => {
  const { name, description, duration, price, image } = req.body;

  try {
    const newMassage = await Massage.create({
      name,
      description,
      duration,
      price,
      image
    });

    res.json(newMassage);
  } catch (error) {
    console.log('An error occurred creating a new massage', error);
    next(error);
  }
});

router.get('/massages', async (req, res, next) => {
  try {
    const allMassages = await Massage.find();
    res.json(allMassages);
  } catch (error) {
    console.log('An error occurred getting all massages', error);
    next(error);
  }
});

router.get('/massages/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Specified id is not valid' });
    }

    const massage = await Massage.findById(id);

    if (!massage) {
      return res.status(404).json({ message: 'No massage found with that id' });
    }

    res.json(massage);
  } catch (error) {
    console.log('An error occurred getting the massage', error);
    next(error);
  }
});

router.put('/massages/:id', async (req, res, next) => {
  const { id } = req.params;
  const { name, description, duration, price, image } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Specified id is not valid' });
    }

    const updatedMassage = await Massage.findByIdAndUpdate(
      id,
      {
        name,
        description,
        duration,
        price,
        image
      },
      { new: true }
    );

    if (!updatedMassage) {
      return res
        .status(404)
        .json({ message: 'No massage found with specified id' });
    }

    res.json(updatedMassage);
  } catch (error) {
    console.log('An error occurred updating the massage', error);
    next(error);
  }
});

router.delete('/massages/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Specified id is not valid' });
    }

    await Massage.findByIdAndDelete(id);
    res.json({ message: `Massage with id ${id} has deleted successfully` });
  } catch (error) {
    console.log('An error occurred deleting the massage', error);
    next(error);
  }
});

router.post('/upload', fileUploader.single('file'), (req, res) => {
  try {
    res.json({ fileUrl: req.file.path });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred uploading the image' });
    next(error);
  }
});

module.exports = router;
