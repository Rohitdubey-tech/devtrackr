import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const fixIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const collections = await mongoose.connection.db.listCollections().toArray();
    const snippetsExists = collections.some(c => c.name === "snippets");

    if (snippetsExists) {
      console.log("Found snippets collection. Dropping text index...");
      // Drop all indexes on snippets collection to ensure the bad one is gone
      // Mongoose will recreate the correct ones on next start
      await mongoose.connection.db.collection("snippets").dropIndexes();
      console.log("Successfully dropped indexes. Mongoose will recreate them with the correct settings now.");
    } else {
      console.log("Snippets collection not found. No index to drop.");
    }

    process.exit(0);
  } catch (err) {
    console.error("Error fixing index:", err);
    process.exit(1);
  }
};

fixIndex();
