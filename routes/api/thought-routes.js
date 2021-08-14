const router = require('express').Router();
const {
  getAllThoughts,
  getThoughtById,
  newThought,
  updateThought, 
  removeThought
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


module.exports = router;