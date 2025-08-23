import mongoose from 'mongoose';

export interface IPost extends mongoose.Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  excerpt?: string;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new mongoose.Schema<IPost>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    minlength: [10, 'Content must be at least 10 characters']
  },
  excerpt: {
    type: String,
    maxlength: [200, 'Excerpt cannot be more than 200 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  }
}, {
  timestamps: true
});

// Create excerpt from content if not provided
postSchema.pre('save', function(next) {
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.substring(0, 150) + '...';
  }
  next();
});

export default mongoose.models.Post || mongoose.model<IPost>('Post', postSchema);
