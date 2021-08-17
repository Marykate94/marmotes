const { User, Thought } = require("../models");

const thoughtController = {
    //get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
            .populate({ path: "reactions", select: "-__v" })
            .select("-__v")
            // .sort({_id: -1}) not sure if needed
            .then((dbThoughtData) => res.json(dbThoughtData))
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // get a single thought by id
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
            .populate({
                path: "reactions",
                select: "-__v"
            })
            .select("-__v")
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
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
          }
          res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },
    // update a thought by its id
      updateThought({ params, body}, res) {
          Thought.findOneAndUpdate({ _id: params.id }, body, {
              new: true,
              runValidators: true
          })
          .populate({
            path: 'reactions',
            select: '-__v'
          })
          .select('-__v')
          .then(dbThoughtData => res.json(dbThoughtData))
          .catch(err => {
            console.log(err);
            res.sendStatus(400);
          });
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
        { _id: params.reactionId },
        { $push: { reactions: body } },
        { new: true, runValidators: true }
      )
        .populate({ path: "reactions", select: "-__v" })
        .select("-__v")
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
    removeReaction({ params, body }, res) {
      Thought.findByIdAndDelete({ _id: params.reactionId })
      .then(deletedReaction => {
        if (!deletedReaction) {
          return res.status(404).json({ message: 'No reaction with this id!' });
        }
        return Thought.findOneAndUpdate(
          { _id: params.reactionId },
          { $pull: { reactions: params.reactionId } },
          { new: true }
        );
      })
      .populate({ path: "reactions", select: "-__v" })
      .select("-__v")
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No reaction found with this id!' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.json(err));
  },

};

module.exports = thoughtController;