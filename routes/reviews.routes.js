const router = require('express').Router();
const Review = require('../models/Review.model');
const Massage = require('../models/Massage.model');

router.post('/reviews', async (req, res, next) => {
  const { reviewText, rating, massageId, userId } = req.body;

  try {
    const newReview = await Review.create({
      reviewText,
      rating,
      massage: massageId,
      user: userId
    });

    await Massage.findByIdAndUpdate(massageId, {
      $push: { reviews: newReview._id }
    });

    res.json(newReview);
  } catch (error) {
    console.log('An error occurred creating the review', error);
    next(error);
  }
});

module.exports = router;
