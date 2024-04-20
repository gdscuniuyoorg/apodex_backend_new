import mongoose, { ConnectOptions } from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    if (process.env.DB_URL) {
      throw new Error('DB url is missing from .env variable');
    }

    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    console.log('DB connection successful');
  } catch (error) {
    console.error('An error occured connecting to DB', error);
  }
};

export default connectDB;
