import ReviewsDAO from "../dao/reviewsDAO.js";

export default class ReviewsController {

    static async apiPostReview(req, res, next) {
        try {
            const movieId = req.body.movie_id;
            const review = req.body.review;
            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id,
            }

            const date = new Date();

            const reviewResponse = await ReviewsDAO.addReview(
                movieId,
                userInfo,
                review,
                date
            );

            var {insertedId} = reviewResponse;

            if (!insertedId) {
                res.status(500).json({error: "Unable to post review."});
            } else {
                res.json({
                    status: "success",
                });
            }
        } catch (e) {
            res.status(500).json({error: e.message});
        }
    }

    static async apiUpdateReview(req, res, next) {
        try {
            const reviewId = req.body.review_id;
            const review = req.body.review;
            const userId = req.body.user_id;
            const date = new Date();

            const reviewResponse = await ReviewsDAO.updateReview(
                reviewId,
                userId,
                review,
                date
            );

            let { matchedCount, modifiedCount } = reviewResponse;

            if (!matchedCount) {
                res.status(500).json({ error: "Unable to find given review" });
            } else if (!modifiedCount) {
                res.status(500).json({error: "Unable to update the review."});
            } else {
                res.json({status: "Put success"});
            }
        } catch(e) {
            res.status(500).json({error : e.message});
        }
    }

    static async apiDeleteReview(req, res, next) {
        const reviewId = req.body.review_id;
        const userId = req.body.user_id;

        const reviewResponse = await ReviewsDAO.deleteReview(
            reviewId,
            userId
        );

        let { deletedCount } = reviewResponse;
        if (!deletedCount) {
            res.status(500).json({ error: "Unable to delete review."});
        } else {
            res.json({ status: "Deletion success" });
        }
    }
}