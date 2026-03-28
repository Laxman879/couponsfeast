import mongoose from "mongoose";

const blogArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  content: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("BlogArticle", blogArticleSchema);
