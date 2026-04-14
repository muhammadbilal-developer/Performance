import mongoose from "mongoose";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/next_blog_db";

const blogImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    alt: { type: String, required: true },
  },
  { _id: false }
);

const blogSectionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["paragraph", "image"], required: true },
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

function createImagesForBlog(index) {
  return Array.from({ length: 6 }, (_, imageIndex) => {
    const seed = `blog-${index + 1}-img-${imageIndex + 1}`;
    return {
      url: `https://picsum.photos/seed/${seed}/1200/800`,
      alt: `Blog ${index + 1} image ${imageIndex + 1}`,
    };
  });
}

function createParagraph(seed, paragraphNumber) {
  const sentence = `Blog ${seed} explains practical Next.js and MongoDB optimization patterns for production-grade applications with measurable outcomes and repeatable delivery standards.`;
  return `${sentence} ${sentence} ${sentence} ${sentence} ${sentence} Paragraph ${paragraphNumber}.`;
}

function createLongParagraphs(seed) {
  return Array.from({ length: 24 }, (_, index) => createParagraph(seed, index + 1));
}

function createBlog(index) {
  const blogNumber = index + 1;
  const images = createImagesForBlog(index);
  const paragraphs = createLongParagraphs(blogNumber);

  const contentSections = [];
  paragraphs.forEach((paragraph, paragraphIndex) => {
    contentSections.push({ type: "paragraph", text: paragraph });
    if (paragraphIndex === 3) contentSections.push({ type: "image", image: images[1] });
    if (paragraphIndex === 8) contentSections.push({ type: "image", image: images[2] });
    if (paragraphIndex === 13) contentSections.push({ type: "image", image: images[3] });
    if (paragraphIndex === 18) contentSections.push({ type: "image", image: images[4] });
    if (paragraphIndex === 22) contentSections.push({ type: "image", image: images[5] });
  });

  return {
    slug: `blog-${blogNumber}`,
    title: `Performance Blog ${blogNumber}`,
    excerpt: `A deep performance walkthrough for blog ${blogNumber}, including rendering strategy, database efficiency, and media loading best practices.`,
    headerImage: images[0],
    contentSections,
    createdAt: new Date(Date.now() - index * 60_000),
  };
}

async function seedBlogs() {
  try {
    await mongoose.connect(uri);
    const blogs = Array.from({ length: 50 }, (_, index) => createBlog(index));

    await Blog.deleteMany({});
    const result = await Blog.insertMany(blogs);
    console.log(`Seed complete. Inserted ${result.length} blogs.`);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedBlogs();
