const serviceService = require('../services/serviceService');

class ServiceController {
  // GET /api/services - Récupérer tous les services
  async getServices(req, res) {
    try {
      console.log('GET /api/services - Query:', req.query);
      
      const { type, status } = req.query;
      
      const filters = {};
      if (type) filters.type = type;
      if (status) filters.status = status;

      const result = await serviceService.getAllServices(filters);
      
      if (!result.success) {
        return res.status(result.status || 500).json({
          success: false,
          error: result.error
        });
      }

      res.json({
        success: true,
        data: result.data,
        count: result.data.length
      });
    } catch (error) {
      console.error('Error in getServices controller:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur serveur lors de la récupération des services'
      });
    }
  }

  // GET /api/services/:id - Récupérer un service par ID
  async getService(req, res) {
    try {
      const { id } = req.params;
      console.log('GET /api/services/' + id);

      const result = await serviceService.getServiceById(id);
      
      if (!result.success) {
        return res.status(result.status || 404).json({
          success: false,
          error: result.error
        });
      }

      res.json({
        success: true,
        data: result.data
      });
    } catch (error) {
      console.error('Error in getService controller:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur serveur lors de la récupération du service'
      });
    }
  }

  // POST /api/services - Créer un nouveau service
  async createService(req, res) {
    try {
      console.log('POST /api/services - Body:', req.body);

      const { title, description, price, status, type } = req.body;

      // Validation basique
      if (!title || !description || !price || !type) {
        return res.status(400).json({
          success: false,
          error: 'Tous les champs sont obligatoires: titre, description, prix, type'
        });
      }

      const serviceData = {
        title: title.trim(),
        description: description.trim(),
        price: price.trim(),
        status: status || 'active',
        type
      };

      const result = await serviceService.createService(serviceData);
      
      if (!result.success) {
        return res.status(result.status || 400).json({
          success: false,
          error: result.error,
          details: result.details
        });
      }

      res.status(201).json({
        success: true,
        message: 'Service créé avec succès',
        data: result.data
      });
    } catch (error) {
      console.error('Error in createService controller:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur serveur lors de la création du service'
      });
    }
  }

  // PUT /api/services/:id - Mettre à jour un service
  async updateService(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      console.log('PUT /api/services/' + id, '- Body:', updateData);

      const result = await serviceService.updateService(id, updateData);
      
      if (!result.success) {
        return res.status(result.status || 404).json({
          success: false,
          error: result.error,
          details: result.details
        });
      }

      res.json({
        success: true,
        message: 'Service mis à jour avec succès',
        data: result.data
      });
    } catch (error) {
      console.error('Error in updateService controller:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur serveur lors de la mise à jour du service'
      });
    }
  }

  // DELETE /api/services/:id - Supprimer un service
  async deleteService(req, res) {
    try {
      const { id } = req.params;
      console.log('DELETE /api/services/' + id);

      const result = await serviceService.deleteService(id);
      
      if (!result.success) {
        return res.status(result.status || 404).json({
          success: false,
          error: result.error
        });
      }

      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Error in deleteService controller:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur serveur lors de la suppression du service'
      });
    }
  }

  // GET /api/services/type/:type - Récupérer les services par type
  async getServicesByType(req, res) {
    try {
      const { type } = req.params;
      console.log('GET /api/services/type/' + type);

      // Validation du type
      const validTypes = ['coffee', 'lunch', 'rooms'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          error: 'Type de service invalide'
        });
      }

      const result = await serviceService.getServicesByType(type);
      
      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: result.error
        });
      }

      res.json({
        success: true,
        data: result.data,
        count: result.data.length
      });
    } catch (error) {
      console.error('Error in getServicesByType controller:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur serveur lors de la récupération des services'
      });
    }
  }
}

module.exports = new ServiceController();