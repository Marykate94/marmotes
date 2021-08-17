const router = require('express').Router();
const {
  getAllThoughts,
  getThoughtById,
  newThought,
  updateThought, 
  removeThought,
  addReaction, 
  removeReaction
} = require('../../controllers/thought-controller');

//get all thoughts
router.route("/").get(getAllThoughts);

// /api/thought/<userId>
router.route('/:userId').post(newThought);

// /api/thoughts/<userId>/<thoughtId>
router
  .route('/:id')
  .get(getThoughtById)
  .put(updateThought)
  .delete(removeThought);

// thoughtId/reactions
router
  .route('/:thoughtId/reactions')
  .post(addReaction);

router 
  .route('/:thoughtId/reactions/:reactionId')
  .delete(removeReaction);


module.exports = router;