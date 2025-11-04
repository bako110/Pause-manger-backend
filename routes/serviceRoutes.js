const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - price
 *         - type
 *       properties:
 *         id:
 *           type: string
 *           description: ID auto-généré du service
 *         title:
 *           type: string
 *           description: Titre du service
 *           maxLength: 100
 *         description:
 *           type: string
 *           description: Description détaillée du service
 *           maxLength: 500
 *         price:
 *           type: string
 *           description: Prix du service (format libre)
 *         status:
 *           type: string
 *           enum: [active, new, limited]
 *           description: Statut du service
 *           default: active
 *         type:
 *           type: string
 *           enum: [coffee, lunch, rooms]
 *           description: Type de service
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date de mise à jour
 *       example:
 *         id: 507f1f77bcf86cd799439011
 *         title: "Pause Café Premium"
 *         description: "Café, thé, et viennoiseries sélectionnées"
 *         price: "8,50 €"
 *         status: "active"
 *         type: "coffee"
 *         createdAt: "2023-10-05T14:48:00.000Z"
 *         updatedAt: "2023-10-05T14:48:00.000Z"
 */

// Routes principales
router.get('/', serviceController.getServices);
router.post('/', serviceController.createService);
router.get('/type/:type', serviceController.getServicesByType);

// Routes avec ID
router.get('/:id', serviceController.getService);
router.put('/:id', serviceController.updateService);
router.delete('/:id', serviceController.deleteService);

module.exports = router;