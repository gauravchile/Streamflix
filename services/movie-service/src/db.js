import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Connecting to Mongo:", process.env.MONGO_URL);
    await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 5000
    });

    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

export default connectDB;
