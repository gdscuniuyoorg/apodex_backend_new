import ENV from "./env_files";
import mongoose, { ConnectOptions } from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    if (!ENV.DB_URL) {
      throw new Error("DB url is missing from .env variable");
    }

    await mongoose.connect(ENV.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    console.log("DB connection successful");
  } catch (error) {
    console.error("An error occured connecting to DB", error);
  }
};

export default connectDB;
