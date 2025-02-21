import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaStar } from 'react-icons/fa';

const Reviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [description, setDescription] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/reviews');
      
      if (response.data.success && response.data.data.reviews) {
        setReviews(response.data.data.reviews);
      }

      // Check if current user has already submitted a review
      if (user) {
        const existingReview = response.data.data.reviews.find(
          review => review.userName === user.name
        );
        setHasSubmitted(!!existingReview);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/reviews', {
        rating,
        description,
        userName: user.name,
        user: user.uid // Using Firebase UID
      });

      if (response.data.success) {
        toast.success('Review submitted successfully!');
        setRating(0);
        setDescription('');
        setHasSubmitted(true);
        fetchReviews();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  return (
    <div className="bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
            Community Reviews
          </h2>
          <p className="mt-4 text-xl text-gray-400">
            Hear what our users have to say about their FitQuest journey
          </p>
        </div>

        {/* Review Form Section */}
        {!hasSubmitted && user && (
          <div className="max-w-2xl mx-auto mb-16 bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
            <div className="px-6 py-8">
              <h3 className="text-2xl font-bold text-white mb-6">
                Share Your Experience
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rating Stars */}
                <div>
                  <label className="block text-lg font-medium text-gray-300 mb-2">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, index) => {
                      const ratingValue = index + 1;
                      return (
                        <button
                          type="button"
                          key={ratingValue}
                          className={`${
                            ratingValue <= (hover || rating)
                              ? 'text-yellow-400'
                              : 'text-gray-500'
                          } text-3xl focus:outline-none transition-colors duration-200 hover:scale-110`}
                          onClick={() => setRating(ratingValue)}
                          onMouseEnter={() => setHover(ratingValue)}
                          onMouseLeave={() => setHover(rating)}
                        >
                          <FaStar />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Review Text */}
                <div>
                  <label className="block text-lg font-medium text-gray-300 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Tell us about your experience..."
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 px-6 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-105"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : (
          /* Reviews Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-gray-800 rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105"
              >
                <div className="p-6">
                  {/* Review Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {review.userName}
                      </h3>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, index) => (
                          <FaStar
                            key={index}
                            className={`h-5 w-5 ${
                              index < review.rating
                                ? 'text-yellow-400'
                                : 'text-gray-500'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Review Content */}
                  <p className="text-gray-300 leading-relaxed">
                    {review.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Reviews Message */}
        {!loading && reviews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">
              No reviews yet. Be the first to share your experience!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;