import mongoose from "mongoose";
import env from "./src/config/env.js";
import User from "./src/models/User.js";

async function run() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log("Connected to MongoDB");
    const user = await User.findOne({ email: "demo@devtrackr.io" });
    if (user) {
      console.log("Found demo user:", user.email);
    } else {
      console.log("Demo user NOT found");
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    process.exit(0);
  }
}
run();
