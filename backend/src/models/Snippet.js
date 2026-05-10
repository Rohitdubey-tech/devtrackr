import mongoose from "mongoose";

const snippetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Snippet title is required"],
      trim: true,
      maxlength: 100,
    },
    code: {
      type: String,
      required: [true, "Code content is required"],
      maxlength: 10000,
    },
    language: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    description: {
      type: String,
      default: "",
      maxlength: 500,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Full-text search index on title, code, and tags
snippetSchema.index(
  { title: "text", code: "text", tags: "text" },
  { language_override: "none" }
);
snippetSchema.index({ user: 1, language: 1 });
snippetSchema.index({ user: 1, isFavorite: 1 });

const Snippet = mongoose.model("Snippet", snippetSchema);
export default Snippet;
