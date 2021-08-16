const { User } = require("../models");

const userController = {
    // get all users
    getAllUsers(req, res) {
        User.find({})
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    // get a single user by id and populated thought and friend data
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .populate({ path: "thoughts", select: "-_V" })
            .populate({ path: "friends", select: "-_V" })
            .select("-_V")
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    // post a new user 
    createUser({ body }, res) {
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.json(err));
    },

    // put to update a user by its id
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
          .then(dbUserData => {
            if (!dbUserData) {
              res.status(404).json({ message: 'No user was found with this id!' });
              return;
            }
            res.json(dbUserData);
          })
          .catch(err => res.json(err));
      },

    // delete to remove user by its id
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
          .then(dbUserData => res.json(dbUserData))
          .catch(err => res.json(err));
      },

    //bonus remove users associated thoughts when deleted 

    // post to add a new friend to a users friend list by pulling user id of associated friend
    addFriend({ params }, res) {
        User.findOneAndUpdate(
          { _id: params.id },
          { $push: { friends: params.friendId } },
          { new: true }
        )
          .populate({ path: "friends", select: "-__v" })
          .select("-__v")
          .then((dbUserData) => {
            if (!dbUserData) {
              res.status(404).json({ message: "NO FRIEND FOUND" });
              return;
            }
            res.json(dbUserData);
          })
          .catch((err) => res.json(err));
      },

    // delete to remove a friend from a users friend list
    deleteFriend({ params }, res) {
        User.findOneAndUpdate(
          { _id: params.id },
          { $pull: { friends: params.friendId } },
          { new: true }
        )
          .populate({ path: "friends", select: "-__v" })
          .select("-__v")
          .then((dbUserData) => {
            if (!dbUserData) {
              res.status(404).json({ message: "NO FRIEND FOUND" });
              return;
            }
            res.json(dbUserData);
          })
          .catch((err) => res.status(400).json(err));
      },
};

module.exports = userController;