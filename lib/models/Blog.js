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
      enum: ["heading", "paragraph", "image"],
      required: true,
    },
    level: { type: Number, min: 2, max: 4 },
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
    category: { type: String, index: true, default: "" },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", index: true },
    headerImage: { type: blogImageSchema, required: true },
    logoImage: { type: blogImageSchema },
    seo: {
      metaTitle: { type: String, required: true },
      metaDescription: { type: String, required: true },
      keywords: { type: [String], default: [] },
      canonicalUrl: { type: String, required: true },
    },
    contentHtml: { type: String, default: "" },
    contentSections: { type: [blogSectionSchema], required: true },
  },
  { timestamps: true }
);

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

export default Blog;
