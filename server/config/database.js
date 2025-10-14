import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const fallbackUri = 'mongodb://127.0.0.1:27017/hr_management_system';
    const mongoUri = process.env.MONGODB_URI || fallbackUri;

    if (!process.env.MONGODB_URI) {
      console.warn('[database] MONGODB_URI not set; using default:', fallbackUri);
    }

    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[database] Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
