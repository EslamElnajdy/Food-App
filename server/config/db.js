import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose.connect("mongodb+srv://dev:Zw6UU9Fnqn6682Ee@cluster0.0z43d.mongodb.net/food-del")
  .then(() => {
    console.log("Successfully connected to the database");
  }).catch((error) => {
    console.log("Error connecting to the database: ", error);
  });
}