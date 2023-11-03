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

  if (!process.env.MONGODB_URL){
    console.log("MONGODB_URL not found");
    return
  } 
  if (isConnected){
    console.log("MongoDB is already connected");
    return
  } 

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};
