const Service = require('../models/services');

class ServiceService {
  // Récupérer tous les services
  async getAllServices(filters = {}) {
    try {
      const query = {};
      
      // Appliquer les filtres
      if (filters.type) query.type = filters.type;
      if (filters.status) query.status = filters.status;
      
      const services = await Service.find(query)
        .sort({ createdAt: -1 })
        .lean();
      
      return { success: true, data: services };
    } catch (error) {
      console.error('Error in getAllServices:', error);
      return { success: false, error: error.message };
    }
  }

  // Récupérer un service par ID
  async getServiceById(serviceId) {
    try {
      const service = await Service.findById(serviceId);
      
      if (!service) {
        return { success: false, error: 'Service non trouvé', status: 404 };
      }
      
      return { success: true, data: service };
    } catch (error) {
      console.error('Error in getServiceById:', error);
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Créer un nouveau service
  async createService(serviceData) {
    try {
      console.log('Creating service with data:', serviceData);
      
      const service = new Service(serviceData);
      const savedService = await service.save();
      
      console.log('Service created successfully:', savedService);
      
      return { success: true, data: savedService, status: 201 };
    } catch (error) {
      console.error('Error in createService:', error);
      
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return { 
          success: false, 
          error: 'Données invalides', 
          details: errors,
          status: 400 
        };
      }
      
      return { 
        success: false, 
        error: error.message, 
        status: 500 
      };
    }
  }

  // Mettre à jour un service
  async updateService(serviceId, updateData) {
    try {
      const service = await Service.findByIdAndUpdate(
        serviceId,
        updateData,
        { new: true, runValidators: true }
      );

      if (!service) {
        return { success: false, error: 'Service non trouvé', status: 404 };
      }

      return { success: true, data: service };
    } catch (error) {
      console.error('Error in updateService:', error);
      
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return { 
          success: false, 
          error: 'Données invalides', 
          details: errors,
          status: 400 
        };
      }
      
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Supprimer un service
  async deleteService(serviceId) {
    try {
      const service = await Service.findByIdAndDelete(serviceId);

      if (!service) {
        return { success: false, error: 'Service non trouvé', status: 404 };
      }

      return { success: true, message: 'Service supprimé avec succès' };
    } catch (error) {
      console.error('Error in deleteService:', error);
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Récupérer les services par type
  async getServicesByType(type) {
    try {
      const services = await Service.find({ type })
        .sort({ createdAt: -1 })
        .lean();
      
      return { success: true, data: services };
    } catch (error) {
      console.error('Error in getServicesByType:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new ServiceService();