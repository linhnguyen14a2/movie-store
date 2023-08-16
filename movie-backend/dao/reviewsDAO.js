import mongodb from 'mongodb';
import {text} from "express";
const ObjectId = mongodb.ObjectId;

let reviews;

export default class ReviewsDAO {

    static async injectDB(conn) {
        if (reviews) {

            return;
        }
        try {
            reviews = await conn.db(process.env.MOVIEREVIEWS_COLLECTION).collection('reviews');
        } catch (e) {
            console.error(`Unable to connect to reviewsDAO: ${e}`);
        }
    }

    static async addReview(movieId, user, review, date) {
        try {
            const reviewDoc = {
                name: user.name,
                user_id: user._id,
                date: date,
                review: review,
                movie_id: new ObjectId(movieId),
            }
            return await reviews.insertOne(reviewDoc);
        } catch (e) {
            console.error(`Unable to post review: ${e}`);
            return {error: e};
        }
    }

    static async updateReview(reviewId, userId, review, date) {
        try {
            return await reviews.updateOne(
                {
                    user_id: userId,
                    _id: new ObjectId(reviewId),
                },
                { $set:
                        {
                            review: review,
                            date: date
                        }
                }
            );
        }
        catch(e) {
            console.error(`Unable to put review: ${e}`)
            return { error: e };
        }
    }

    static async deleteReview(reviewId, userId) {
        try {
            return await reviews.deleteOne({
                user_id: userId,
                _id: new ObjectId(reviewId)
            })
        } catch (e) {
            console.error(`Unable to delete review: ${e}`)
            return { error: e };
        }
    }
}