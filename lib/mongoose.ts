import mongoose from "mongoose";

let isConnected = false;

mongoose.connection.on("error", (err) => {
  isConnected = false;
  console.log("Error connecting to MongoDB", err);
});

mongoose.connection.on("disconnected", () => {
  isConnected = false;
  console.log("Disconnected from MongoDB");
});
export const connectToDB = async () => {
  mongoose.set("strict", true);

  if (!process.env.MONGODB_URL) return console.log("MONGODB_URL not found");
  if (isConnected) return console.log("Already connected to MongoDB");

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};
