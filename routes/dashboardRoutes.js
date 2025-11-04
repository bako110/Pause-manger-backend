const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Statistiques et données du tableau de bord
 */

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Récupère les statistiques du dashboard
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Statistiques récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 coffeePauses:
 *                   type: object
 *                   properties:
 *                     today:
 *                       type: number
 *                     thisWeek:
 *                       type: number
 *                     next:
 *                       type: string
 *                 lunches:
 *                   type: object
 *                   properties:
 *                     today:
 *                       type: number
 *                     reservedPlaces:
 *                       type: number
 *                     next:
 *                       type: string
 *                 reservations:
 *                   type: object
 *                   properties:
 *                     ongoing:
 *                       type: number
 *                     thisWeek:
 *                       type: number
 *                     next:
 *                       type: string
 *                 enhancedCoffee:
 *                   type: object
 *                   properties:
 *                     today:
 *                       type: number
 *                     thisWeek:
 *                       type: number
 *                     next:
 *                       type: string
 *                 cocktails:
 *                   type: object
 *                   properties:
 *                     scheduled:
 *                       type: number
 *                     thisMonth:
 *                       type: number
 *                     next:
 *                       type: string
 *                 roomRentals:
 *                   type: object
 *                   properties:
 *                     today:
 *                       type: number
 *                     thisWeek:
 *                       type: number
 *                     next:
 *                       type: string
 */
router.get('/stats', dashboardController.getDashboardStats);

/**
 * @swagger
 * /api/dashboard/overview:
 *   get:
 *     summary: Récupère un aperçu complet pour le dashboard
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Données d'aperçu récupérées avec succès
 */
router.get('/overview', dashboardController.getDashboardOverview);

module.exports = router;