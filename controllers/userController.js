const { User, Thought } = require("../models");

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .populate("thoughts")
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  // Get a single user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select("-__v")
      .populate("thoughts")
      .populate("friends")
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  updateUser(req, res) {
    console.log(req.body);
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with that ID :(" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Delete a User
  deleteUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : Thought.deleteMany({ username: user.username }).then((thought) =>
              !thought
                ? res.status(404).json({
                    message:
                      "An error occured deleting the users thoughts, please try again",
                  })
                : User.findOneAndDelete({ _id: req.params.userId }).then(
                    (user) =>
                      !user
                        ? res
                            .status(404)
                            .json({ message: "No user with that ID" })
                        : res.json({
                            message: "User and associated thoughts deleted!",
                          })
                  )
            )
      )
      .catch((err) => res.status(500).json(err));
  },
  // Add a friend
  addFriend(req, res) {
    console.log("You are adding a Friend! Woo! Friends!");
    console.log(req.body);
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with that ID :(" })
          : User.findOneAndUpdate(
              { _id: req.params.friendId },
              { $addToSet: { friends: req.params.userId } },
              { new: true }
            ).then((user) =>
              !user
                ? res.status(404).json({
                    message:
                      "There was a problem adding you as a friend, your friends list is accurate but not your friends.",
                  })
                : res.json({
                    message: "This is the start of a beautiful friendship!",
                  })
            )
      )
      .catch((err) => res.status(500).json(err));
  },
  // Remove a Friend :(
  removeFriend(req, res) {
    console.log("DELETING A FRIEND!! D:<");
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with that ID :(" })
          : User.findOneAndUpdate(
              { _id: req.params.friendId },
              { $pull: { friends: req.params.userId } },
              { new: true }
            ).then((user) =>
              !user
                ? res.status(404).json({
                    message:
                      "There was a problem adding you as a friend, your friends list is accurate but not your friends.",
                  })
                : res.json({
                    message: "Oh no! How sad! :(",
                  })
            )
      )
      .catch((err) => res.status(500).json(err));
  },
};
