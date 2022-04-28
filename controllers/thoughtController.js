const { Thought, User } = require("../models");

module.exports = {
  // Get all Thoughts
  getThoughts(req, res) {
    Thought.find()
      .then(async (thoughts) => {
        const thoughtObj = {
          thoughts,
        };
        return res.json(thoughtObj);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Get a single Thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select("-__v")
      .then(async (thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with that ID! D:" })
          : res.json({
              thought,
            })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // create a new Thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: "An error occured please try again!" })
          : User.findOneAndUpdate(
              { username: thought.username },
              { $addToSet: { thoughts: thought._id } },
              { new: true }
            ).then((user) =>
              !user
                ? res
                    .status(404)
                    .json({ message: "No user found! Please try again!" })
                : res.json(user)
            )
      )
      .catch((err) => console.log(err));
  },

  updateThought(req, res) {
    console.log(req.body);
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { new: true }
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: "No thought found with that ID :(" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Delete a Thought
  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No such thought exists" })
          : User.findOneAndUpdate(
              { username: thought.username },
              { $pull: { thoughts: thought._id } },
              { new: true }
            ).then((user) =>
              !user
                ? res
                    .status(404)
                    .json({ message: "No user found! Please try again!" })
                : res.json(user)
            )
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Add a Reaction to a Thought
  addReaction(req, res) {
    console.log("You are adding a Reaction! How Cool!");
    console.log(req.body);
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { new: true }
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: "No thought found with that ID :(" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Remove assignment from a student
  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: "No thought found with that ID :(" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
};
