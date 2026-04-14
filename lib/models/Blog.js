import mongoose from "mongoose";

const blogImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    alt: { type: String, required: true },
  },
  { _id: false }
);

const blogSectionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["paragraph", "image"],
      required: true,
    },
    text: { type: String },
    image: blogImageSchema,
  },
  { _id: false }
);

const blogSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    headerImage: { type: blogImageSchema, required: true },
    contentSections: { type: [blogSectionSchema], required: true },
  },
  { timestamps: true }
);

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

export default Blog;
