import Comments from '../models/Comments.js';

const addComment = async (req, res) => {
  try {
    const commentToAdd = await Comments.create(req.body);
    res.status(201).json(commentToAdd);
  } catch (error) {
    res.status(500).json(error);
  }
};
const getComments = async (req, res) => {
  const postId = req.params.postID;
  try {
    const comments = await Comments.find({ postId });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json(error);
  }
};

const editComment = async (req, res) => {
  const commentId = req.params.commentID;
  try {
    const comment = await Comments.findByIdAndUpdate(commentId, req.body, {
      new: true,
    });
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteComment = async (req, res) => {
  const commentId = req.params.commentID;
  try {
    await Comments.findByIdAndDelete(commentId);
    res.status(200).json('Deleted');
  } catch (error) {
    res.status(500).json(error);
  }
};

export { deleteComment, addComment, getComments, editComment };
