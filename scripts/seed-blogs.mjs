import mongoose from "mongoose";
import Blog from "../lib/models/Blog.js";
const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/next_blog_db";

const articleTopics = [
  "Understanding Value Added Tax (VAT): A Comprehensive Guide",
  "How VAT Inclusive Pricing Works for Online Stores",
  "VAT vs GST: Core Differences Every Business Must Know",
  "How to Calculate VAT for Services and Digital Products",
  "Best Practices for VAT Invoicing and Record Keeping",
  "Beginner Guide to Input Tax Credit and Output Tax",
  "How Small Businesses Should Plan VAT Returns",
  "International VAT Rules for Cross-Border Ecommerce",
  "VAT Compliance Checklist for Growing Teams",
  "How to Avoid Common VAT Calculation Mistakes",
];

const sectionHeadings = [
  "What is VAT?",
  "How VAT Works in Real Transactions",
  "Key Concepts and Terminology",
  "Formula, Examples, and Practical Steps",
  "Common Mistakes and How to Avoid Them",
  "Compliance Workflow and Filing Rhythm",
  "Digital Economy Impact",
  "Final Recommendations",
];

function createImagesForBlog(index) {
  return Array.from({ length: 6 }, (_, imageIndex) => {
    const seed = `blog-${index + 1}-img-${imageIndex + 1}`;
    return {
      url: `https://picsum.photos/seed/${seed}/1200/800`,
      alt: `Blog ${index + 1} image ${imageIndex + 1}`,
    };
  });
}

function createParagraph(topic, paragraphNumber) {
  const sentenceA = `${topic} affects pricing, margins, and tax transparency in every stage of supply and consumption.`;
  const sentenceB = `Teams that standardize calculation logic, documentation, and invoice validation reduce compliance risk and improve reporting quality.`;
  const sentenceC = `A reliable VAT workflow includes rate verification, taxable value checks, credit tracking, and timely filing with complete evidence.`;
  const sentenceD = `When calculators are used with consistent assumptions, businesses improve planning, avoid underpayment, and communicate totals clearly with clients.`;
  return `${sentenceA} ${sentenceB} ${sentenceC} ${sentenceD} Paragraph ${paragraphNumber}.`;
}

function createLongParagraphs(topic, index) {
  const paragraphCount = 18 + (index % 10);
  return Array.from({ length: paragraphCount }, (_, i) => createParagraph(topic, i + 1));
}

function createListHtml(type) {
  const items = [
    "Confirm VAT rate for the selected product or service category.",
    "Validate taxable amount before applying the percentage formula.",
    "Store invoices and credits with clear date-based references.",
    "Review monthly totals before submitting the return.",
  ];
  if (type === "ordered") {
    return `<ol>${items.map((item) => `<li>${item}</li>`).join("")}</ol>`;
  }
  return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function createTableHtml() {
  return `<table><thead><tr><th>Stage</th><th>Amount</th><th>VAT</th></tr></thead><tbody><tr><td>Supplier</td><td>$100</td><td>$10</td></tr><tr><td>Wholesaler</td><td>$200</td><td>$20</td></tr><tr><td>Retailer</td><td>$300</td><td>$30</td></tr></tbody></table>`;
}

function createContentHtml(topic, images, index) {
  const paragraphs = createLongParagraphs(topic, index);
  const imageCount = 4 + (index % 3); // 4 to 6 images
  const selectedImages = images.slice(0, imageCount);
  const blocks = [];

  blocks.push(`<p>${paragraphs[0]}</p>`);
  blocks.push(`<p>Use our <a href="/blog">calculator article library</a> to compare methods, assumptions, and tax scenarios for different industries.</p>`);

  sectionHeadings.forEach((heading, headingIndex) => {
    blocks.push(`<h2>${heading}</h2>`);
    const start = Math.floor((paragraphs.length / sectionHeadings.length) * headingIndex);
    const chunk = paragraphs.slice(start, start + 2);
    chunk.forEach((paragraph) => blocks.push(`<p>${paragraph}</p>`));

    if (headingIndex % 2 === 0) {
      blocks.push("<h3>Quick Checklist</h3>");
      blocks.push(createListHtml(headingIndex % 4 === 0 ? "ordered" : "unordered"));
    }

    if (headingIndex === 3) {
      blocks.push(createTableHtml());
    }
  });

  selectedImages.forEach((image, imageIndex) => {
    const insertAt = 2 + imageIndex * 4;
    blocks.splice(insertAt, 0, `<img src="${image.url}" alt="${image.alt}" />`);
  });

  return blocks.join("");
}

function createBlog(index) {
  const blogNumber = index + 1;
  const articleTopic = articleTopics[index % articleTopics.length];
  const images = createImagesForBlog(index);
  const slug = `${articleTopic.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replaceAll(" ", "-")}-${blogNumber}`;
  const title = `${articleTopic} (${blogNumber})`;
  const contentHtml = createContentHtml(articleTopic, images, index);
  const firstParagraph = contentHtml.match(/<p>(.*?)<\/p>/)?.[1] || "";

  return {
    slug,
    title,
    category: "Calculators",
    excerpt: firstParagraph,
    headerImage: images[0],
    seo: {
      metaTitle: `${title} | Free Online Calculator Guide`,
      metaDescription: firstParagraph,
      keywords: [
        "vat calculator",
        "calculator",
        articleTopic.toLowerCase(),
        "free calculator",
        "financial calculator guide",
      ],
      canonicalUrl: `https://example.com/blog/${slug}`,
    },
    contentHtml,
    contentSections: [{ type: "paragraph", text: firstParagraph }],
    createdAt: new Date(Date.now() - index * 60_000),
  };
}

async function seedBlogs() {
  try {
    await mongoose.connect(uri);
    const blogs = Array.from({ length: 40 }, (_, index) => createBlog(index));

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
