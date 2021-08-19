const { User, Thought } = require("../models");

const thoughtController = {
    //get all thoughts
    getAllThoughts(req, res) {
      Thought.find({})
          .populate({
              path: 'user',
              select: '-__v'
          })
          .select('-__v')
          .sort({ _id: -1 })
          .then(dbThoughtData => res.json(dbThoughtData))
          .catch(err => {
              console.log(err);
              res.sendStatus(400);
          });
  },

    // get a single thought by id
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
            .populate({
                path: 'user',
                select: "-__v"
            })
            .select("-__v")
            .sort({ _id: -1 })
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    // create a new thought - push created thoughts id to the associated users thoughts array field-
    newThought({ params, body }, res) {
      Thought.create(body)
        .then(({ _id }) => {
          return User.findOneAndUpdate(
            { _id: params.userId },
            { $push: { thoughts: _id } },
            { new: true }
          );
        })
        .then(dbThoughtData => {
          console.log(dbThoughtData);
          if (!dbThoughtData) {
            res.status(404).json({ message: 'No user found' });
            return;
          }
          res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },
    // update a thought by its id
    updateThought({ params, body }, res) {
      Thought.findOneAndUpdate({ _id: params.id }, body, { new: true })
          .then(dbThoughtData => {
              if (!dbThoughtData) {
                  res.status(404).json({ message: 'No thought found with this id!' });
                  return;
              }
              res.json(dbThoughtData);
          })
          .catch(err => res.json(err));
  },

    // delete a thought by its id
    removeThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
          .then(dbThoughtData => {
            if (!dbThoughtData) {
              return res.status(404).json({ message: 'No thought with this id!' });
            }
            res.json(dbThoughtData);
          })
          .catch(err => res.json(err));
      },

    // post to create a reaction stored in a  single thoughts reactions array field 
    addReaction({ params, body }, res) {
      Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $push: { reactions: body } },
        { new: true, runValidators: true }
      )
        .then(dbThoughtData => {
          if (!dbThoughtData) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
          }
          res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },

    // delete to pull and remove a reaction by reactions reactionId value
    removeReaction({ params }, res) {
      Thought.findOneAndUpdate(
          { _id: params.thoughtId },
          { $pull: { reactions: { reactionId: params.reactionId } } },
          { new: true }
      )
          .then(dbThoughtData => res.json(dbThoughtData))
          .catch(err => res.json(err));
  }

};

module.exports = thoughtController;