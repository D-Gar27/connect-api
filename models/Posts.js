import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    username: {
      required: true,
      type: String,
    },
    caption: {
      type: String,
      max: 700,
    },
    postImgs: {
      type: [String],
      default: [],
      validate: [arrayLimit, 'Maximum 5 photos'],
    },
    likes: {
      type: [],
      default: [],
    },
    comments: {
      type: [],
      default: [],
    },
  },
  { timestamps: true }
);

function arrayLimit(val) {
  return val.length <= 5;
}

export default mongoose.model('Post', PostSchema);
