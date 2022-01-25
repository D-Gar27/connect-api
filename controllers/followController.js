import Users from '../models/Users.js';

const followUser = async (req, res) => {
  try {
    if (req.body.username !== req.params.username) {
      const userToFollow = await Users.findOne({
        username: req.params.username,
      });
      const userFollowing = await Users.findOne({
        username: req.body.username,
      });
      if (userToFollow.followers?.includes(userFollowing.username)) {
        return res.status(400).json('You have already followed this user');
      } else {
        await userToFollow.updateOne({
          $push: { followers: req.body.username },
        });
        await userFollowing.updateOne({
          $push: { following: req.params.username },
        });
        return res.status(200).json('Followed');
      }
    } else {
      return res.status(400).json("You can't follow your account");
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

const unfollowUser = async (req, res) => {
  try {
    if (req.body.username !== req.params.username) {
      const userToUnfollow = await Users.findOne({
        username: req.params.username,
      });
      const userFollowing = await Users.findOne({
        username: req.body.username,
      });
      if (userToUnfollow.followers?.includes(userFollowing.username)) {
        await userToUnfollow.updateOne({
          $pull: { followers: req.body.username },
        });
        await userFollowing.updateOne({
          $pull: { following: req.params.username },
        });
        return res.status(200).json('Unfollowed');
      } else {
        return res.status(400).json('You are not following this user');
      }
    } else {
      res.status(400).json("You can't unfollow your account");
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export { followUser, unfollowUser };
