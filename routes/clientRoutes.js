const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       required:
 *         - name
 *         - contact
 *         - email
 *         - contractNumber
 *       properties:
 *         id:
 *           type: string
 *           description: ID auto-généré du client
 *         name:
 *           type: string
 *           description: Nom de l'entreprise ou du client
 *           maxLength: 100
 *         contact:
 *           type: string
 *           description: Nom de la personne à contacter
 *           maxLength: 100
 *         email:
 *           type: string
 *           description: Email de contact
 *           format: email
 *         phone:
 *           type: string
 *           description: Numéro de téléphone
 *           maxLength: 20
 *         address:
 *           type: string
 *           description: Adresse postale
 *           maxLength: 200
 *         contractNumber:
 *           type: string
 *           description: Numéro de contrat global
 *           maxLength: 50
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           description: Statut du client
 *           default: active
 *         notes:
 *           type: string
 *           description: Notes supplémentaires
 *           maxLength: 500
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
 *         name: "Entreprise ABC"
 *         contact: "Jean Dupont"
 *         email: "jean@entrepriseabc.com"
 *         phone: "+33 1 23 45 67 89"
 *         address: "123 Rue de Paris, 75001 Paris"
 *         contractNumber: "CT-2023-001"
 *         status: "active"
 *         notes: "Client important"
 *         createdAt: "2023-10-05T14:48:00.000Z"
 *         updatedAt: "2023-10-05T14:48:00.000Z"
 */

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Gestion des clients et contrats
 */

// Routes principales
router.get('/', clientController.getClients);
router.post('/', clientController.createClient);
router.get('/search/:term', clientController.searchClients);
router.get('/stats', clientController.getClientsStats);

// Routes avec ID
router.get('/:id', clientController.getClient);
router.put('/:id', clientController.updateClient);
router.delete('/:id', clientController.deleteClient);

module.exports = router;