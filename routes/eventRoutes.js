const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// @route   GET /api/events
// @desc    Récupérer tous les événements avec filtres optionnels
// @access  Public
router.get('/', eventController.getEvents);

// @route   GET /api/events/upcoming
// @desc    Récupérer les événements à venir
// @access  Public
router.get('/upcoming', eventController.getUpcomingEvents);

// @route   GET /api/events/stats
// @desc    Récupérer les statistiques des événements
// @access  Public
router.get('/stats', eventController.getEventStats);

// @route   GET /api/events/:id
// @desc    Récupérer un événement par son ID
// @access  Public
router.get('/:id', eventController.getEventById);

// @route   POST /api/events
// @desc    Créer un nouvel événement
// @access  Public
router.post('/', eventController.createEvent);

// @route   PUT /api/events/:id
// @desc    Mettre à jour un événement
// @access  Public
router.put('/:id', eventController.updateEvent);

// @route   DELETE /api/events/:id
// @desc    Supprimer un événement
// @access  Public
router.delete('/:id', eventController.deleteEvent);

module.exports = router;