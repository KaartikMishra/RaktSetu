import mongoose from "mongoose";
export const connectDb = async () => {
    try {
        await mongoose.connect('mongodb+srv://kartik:kartik@cluster0.j1ibd9j.mongodb.net/abcdk')
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1); // Exit the process with failure
    }
}