import Posts from '../models/Posts.js';
import Users from '../models/Users.js';

const getWallPost = async (req, res) => {
  try {
    const posts = await Posts.find({ username: req.params.username }).sort({
      createdAt: -1,
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error);
  }
};

const createPosts = async (req, res) => {
  try {
    const post = await Posts.create(req.body);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getPost = async (req, res) => {
  const postId = req.params.postID;
  try {
    const post = await Posts.findById(postId);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
};

const editPost = async (req, res) => {
  const username = req.username.username;
  const postId = req.params.postID;
  try {
    const post = await Posts.findById(postId);
    if (username !== post.username) {
      return res.status(401).json('You are not allowed');
    }
    const updatedPost = await Posts.findByIdAndUpdate(postId, req.body, {
      new: true,
    });
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deletePosts = async (req, res) => {
  const username = req.username.username;
  const postId = req.params.postID;
  try {
    const post = await Posts.findById(postId);
    if (username !== post.username) {
      return res.status(401).json('You are not allowed');
    }
    await post.deleteOne();
    res.status(200).json('Deleted');
  } catch (error) {
    res.status(500).json(error);
  }
};

const likePost = async (req, res) => {
  const postId = req.params.postID;
  const username = req.username.username;
  try {
    const post = await Posts.findById(postId);
    if (!post) return res.status(404).json('Post not found');
    if (post.likes.includes(username)) {
      await post.updateOne({ $pull: { likes: username } });
      return res.status(200).json('Unliked');
    } else {
      await post.updateOne({ $push: { likes: username } });
      return res.status(200).json('Liked');
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const getFeedPosts = async (req, res) => {
  const username = req.username.username;
  try {
    const user = await Users.findOne({ username });
    const userPosts = await Posts.find({ username }).sort({
      createdAt: -1,
    });
    const friendsPost = await Promise.all(
      user.following.map((fri) =>
        Posts.find({ username: fri }).sort({
          createdAt: -1,
        })
      )
    );
    const postsArray = userPosts
      .concat(...friendsPost)
      .sort((a, b) => b?.createdAt - a?.createdAt)
      .slice(0, 21);
    res.status(200).json(postsArray);
  } catch (error) {
    res.status(500).json(error);
  }
};

export {
  createPosts,
  deletePosts,
  getWallPost,
  editPost,
  getPost,
  likePost,
  getFeedPosts,
};
