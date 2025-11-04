// config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Backend Project',
      version: '1.0.0',
      description: 'Documentation de l\'API pour l\'authentification et les autres routes',
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Serveur local' },
    ],
  },
  apis: ['./routes/*.js'], // chemin vers tes fichiers de routes
};

const specs = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));
};

module.exports = setupSwagger;
