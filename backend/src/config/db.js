import mongoose from "mongoose";

export const connectDB = async() => {
    try {
        console.log("MONGO_URL:", process.env.MONGO_URL);
        if (!process.env.MONGO_URL) {
            throw new Error("MONGO_URL environment variable is not defined");
        }
        await mongoose.connect(process.env.MONGO_URL, {})
        console.log("MongoDB Connected")
    } catch (error) {
        console.error("Error connecting to MongoDB", error)
        process.exit(1)
    }
};
