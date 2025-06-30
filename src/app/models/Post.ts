import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  tags: string[];
  postPic?: string;
  author: mongoose.Types.ObjectId;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true, default: "" },
    tags: { type: [String], default: [] },
    postPic: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  },
  { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
export default Post;
