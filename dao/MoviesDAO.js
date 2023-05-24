// 19522428 - Mai Huỳnh Trung
import { ObjectId } from "mongodb";

let movies;

export default class MoviesDAO {
  static async injectDB(conn) {
    if (movies) {
      return;
    }
    try {
      movies = await conn.db(process.env.MOVIESREVIEWS_NS).collection("movies");
    } catch (e) {
      console.error(`unable to connect in MoviesDAO: ${e}`);
    }
  }

  static async getMovies({
    //default filter
    filters = null,
    page = 0,
    moviesPerPage = 20, // mặc định chỉ lấy 20 movies trên 1 page
  } = {}) {
    let query;
    if (filters) {
      if ("title" in filters) {
        query = { $text: { $search: filters["title"] } };
      } else if ("rated" in filters) {
        query = { rated: { $eq: filters["rated"] } };
      }
    }
    let cursor;
    try {
      // skip() được áp dụng trước, còn limit() thì áp dụng cho các documents còn lại sau khi skip.
      cursor = await movies
        .find(query)
        .limit(moviesPerPage)
        .skip(moviesPerPage * page);
      const moviesList = await cursor.toArray();
      const totalNumMovies = await movies.countDocuments(query);
      return { moviesList, totalNumMovies };
    } catch (error) {}
  }
  // static async getMovieById(id) {
  //   try {
  //     return await movies
  //       .aggregate([
  //         { $match: { _id: new ObjectId(id) } },
  //         {
  //           $lookup: {
  //             from: "reviews",
  //             localField: "_id",
  //             foreign: "movie_id",
  //             as: "reviews",
  //           },
  //         },
  //       ]).next();
  //   } catch (error) {
  //     console.error(`something went wrong in getMovieById: ${error}`);
  //     throw error;
  //   }
  // }
  // 19522428 - Mai Huỳnh Trung
  static async getMovieById(id) {
    try {
      return await movies
        .aggregate([
          {
            $match: { _id:new ObjectId(id) },
          },
          {
            $lookup: {
              from: "reviews",
              localField: "_id",
              foreignField: "movie_id",
              as: "reviews",
            },
          },
        ])
        .next();
    } catch (e) {
      console.error(`something went wrong in getMovieById: ${e}`);
      throw e;
    }
  }
  static async getRatings() {
    let ratings = [];
    try {
      ratings = await movies.distinct("rated");
      return ratings;
    } catch (error) {
      console.error(`unable to get ratings, ${error}`);
      return ratings;
    }
  }
}
