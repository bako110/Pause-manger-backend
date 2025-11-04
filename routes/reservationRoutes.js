const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       required:
 *         - room
 *         - date
 *         - startTime
 *         - endTime
 *         - client
 *         - purpose
 *       properties:
 *         id:
 *           type: string
 *           description: ID auto-généré de la réservation
 *         room:
 *           type: string
 *           description: Nom de la salle
 *         date:
 *           type: string
 *           format: date
 *           description: Date de réservation
 *         startTime:
 *           type: string
 *           description: Heure de début
 *         endTime:
 *           type: string
 *           description: Heure de fin
 *         client:
 *           type: string
 *           description: ID du client
 *         event:
 *           type: string
 *           description: ID de l'événement associé
 *         purpose:
 *           type: string
 *           description: Objet de la réservation
 *         status:
 *           type: string
 *           enum: [pending, confirmed, in-use, completed, cancelled]
 *           description: Statut de la réservation
 *         participants:
 *           type: number
 *           description: Nombre de participants
 *         equipment:
 *           type: array
 *           items:
 *             type: string
 *           description: Équipements requis
 */

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Gestion des réservations de salles
 */

// Routes principales
router.get('/', reservationController.getReservations);
router.post('/', reservationController.createReservation);
router.get('/availability', reservationController.checkAvailability);
router.get('/upcoming', reservationController.getUpcomingReservations);
router.get('/stats/weekly', reservationController.getWeeklyStats);

// Routes avec ID
router.get('/:id', reservationController.getReservation);
router.put('/:id', reservationController.updateReservation);
router.delete('/:id', reservationController.deleteReservation);

module.exports = router;