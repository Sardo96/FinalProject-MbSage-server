const router = require('express').Router();
const Review = require('../models/Review.model');
const Massage = require('../models/Massage.model');
const mongoose = require('mongoose');
const { isAuthenticated } = require('../middleware/jwt.middleware');

router.post('/reviews', isAuthenticated, async (req, res, next) => {
  const { reviewText, rating, massageId } = req.body;
  const userId = req.payload._id;

  try {
    const newReview = await Review.create({
      massage: massageId,
      user: userId,
      reviewText,
      rating
    });

    await Massage.findByIdAndUpdate(massageId, {
      $push: { reviews: newReview._id },
      $inc: { totalRating: rating }
    });

    const massage = await Massage.findById(massageId);

    if (!massage) {
      return res.status(404).json({ message: 'No massage found with that id' });
    }

    const existingReviews = massage.reviews.length;
    const newTotalRating = massage.totalRating;
    const newAverageRating = (newTotalRating + rating) / (existingReviews + 1);

    massage.averageRating = newAverageRating;

    await massage.save();

    res.json(newReview);
  } catch (error) {
    console.log('An error occurred creating a new review', error);
    next(error);
  }
});

router.get('/reviews/:massageId', async (req, res, next) => {
  const { massageId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(massageId)) {
      return res
        .status(400)
        .json({ message: 'Specified massageId is not valid' });
    }

    const massage = await Massage.findById(massageId);
    if (!massage) {
      return res.status(404).json({ message: 'Massage not found' });
    }

    const reviews = await Review.find({ massage: massageId });

    res.json(reviews);
  } catch (error) {
    console.log('An error occurred getting the reviews', error);
    next(error);
  }
});

router.get('/reviews/:reviewId', async (req, res, next) => {
  const { reviewId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res
        .status(400)
        .json({ message: 'Specified reviewId is not valid' });
    }

    const review = await Review.findById(reviewId).populate('massage');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(review);
  } catch (error) {
    console.log('An error occurred getting the review', error);
    next(error);
  }
});

router.put('/reviews/:reviewId', isAuthenticated, async (req, res, next) => {
  const { reviewId } = req.params;
  const { reviewText, rating } = req.body;
  const userId = req.payload._id;

  try {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res
        .status(400)
        .json({ message: 'Specified reviewId is not valid' });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to update this review' });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { reviewText, rating },
      { new: true }
    );

    res.json({ message: 'Review updated successfully', review: updatedReview });
  } catch (error) {
    console.log('An error occurred while updating the review', error);
    next(error);
  }
});

router.delete('/reviews/:reviewId', isAuthenticated, async (req, res, next) => {
  const { reviewId } = req.params;
  const userId = req.payload._id;

  try {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res
        .status(400)
        .json({ message: 'Specified reviewId is not valid' });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to delete this review' });
    }

    await Massage.findByIdAndUpdate(review.massage, {
      $pull: { reviews: review._id }
    });

    await Review.findByIdAndDelete(reviewId);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.log('An error occurred while deleting the review', error);
    next(error);
  }
});

module.exports = router;
