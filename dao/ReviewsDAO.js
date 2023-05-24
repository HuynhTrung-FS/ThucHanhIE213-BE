// 19522428 - Mai Huỳnh Trung
import mongodb from "mongodb";

const ObjectId = mongodb.ObjectId;
let reviews;
export default class ReviewsDAO {
  static async injectDB(conn) {
    if (reviews) {
      return;
    }
    try {
      reviews = await conn
        .db(process.env.MOVIEREVIEWS_NS)
        .collection("reviews");
    } catch (error) {
      console.error(`unable to establish connection handle in reviewDAO: ${error}`);
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
      };
      return await reviews.insertOne(reviewDoc);
    } catch (error) {
      console.error(`unable to post review: ${error}`);
      return { error: error };
    }
  }
  static async updateReview(reviewId, userId, review, date) {
    try {
      const updateResponse = await reviews.updateOne(
        { user_id: userId, _id: new ObjectId(reviewId) },
        { $set: { review: review, date: date } }
      );
      console.log(updateResponse)
      return updateResponse;
    } catch (error) {
      console.error(`unable to update review ${error}`);
      return { error: error };
    }
  }
  static async deleteReview(reviewId, userId) {
    try {
      const deleteResponse = await reviews.deleteOne({
        _id: new ObjectId(reviewId),
        user_id: userId,
      });
      return deleteResponse;
    } catch (error) {
      console.error(`unable to delete review: ${error}`);
      return { error: error };
    }
  }
}
