const express = require('express');
const controller = require('../controllers/activityController');
const { isLoggedIn, isHost, isNotHost } = require('../middlewares/auth');
const { validateId, validateConnection, validateResult, validateRSVP } = require('../middlewares/validator');

const router = express.Router();

//GET /stories: send all stories to the user

router.get('/', controller.index);

//GET /stories/new: send html form for creating a new story
router.get('/new', isLoggedIn, controller.new);

//POST /stories: create a new story

router.post('/', isLoggedIn, validateConnection, validateResult, controller.create);

//GET /stories/:id: send details of story by id

router.get('/:id', validateId, controller.show);

//GET /stories/:id/edit: send html form for editing an exsiting story

router.get('/:id/edit', validateId, isLoggedIn, isHost, controller.edit);

//PUT /stories/:id update the story identified by id

router.put('/:id', validateId, isLoggedIn, isHost, controller.update);

//DELETE /stories/:id, delete the story identified by id
router.delete('/:id', validateId, isLoggedIn, isNotHost, validateRSVP, validateResult, controller.rsvp);

router.post('/:id/rsvp', isLoggedIn, isNotHost, validateRSVP, validateResult, controller.rsvp);

module.exports = router;