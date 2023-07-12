import mongoose from "mongoose";
import dotenv from "dotenv";

mongoose.Promise = global.Promise;

dotenv.config();
const { DB_NAME } = process.env;
const connectToDatabase = async (): Promise<void> => {
	mongoose
		.connect(`mongodb://127.0.0.1:27017/${DB_NAME}`)
		.then(async () => {
			console.log("connected to MongoDB!", DB_NAME);
		})
		.catch((err) => {
			console.log("Error connecting to DB...", DB_NAME);
			console.log(err);
		});
};

export { connectToDatabase };
