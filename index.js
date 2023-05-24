// 19522428 - Mai Huỳnh Trung
import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import MoviesDAO from "./dao/MoviesDAO.js";
import ReviewsDAO from "./dao/ReviewsDAO.js";
async function main() {
  dotenv.config();
  const client = new mongodb.MongoClient(process.env.MOVIEREVIEWS_DB_URI);
  const port = process.env.PORT || 8000;
  try {
    await client.connect();
    await MoviesDAO.injectDB(client);
    await ReviewsDAO.injectDB(client);
    app.listen(port, () => {
      console.log("Server is running on port " + port);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
main().catch(console.error);
