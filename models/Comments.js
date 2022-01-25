import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    username: {
      required: true,
      type: String,
    },
    comment: {
      type: String,
      max: 700,
      required: true,
    },
    postId: {
      required: true,
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Comment', CommentSchema);
