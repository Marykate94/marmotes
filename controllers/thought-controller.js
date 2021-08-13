const { Thought, User } = require("../models");

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
        Thought.findOneAndUpdate(
          { _id: params.userId },
          { $push: { thought: _id } },
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

    // delete to pull and remove a reaction by reactions reactionId value
}

module.exports = thoughtController;