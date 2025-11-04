const Client = require('../models/clients');

class ClientService {
  // Récupérer tous les clients
  async getAllClients(filters = {}) {
    try {
      const query = {};
      
      // Appliquer les filtres
      if (filters.search) {
        const searchRegex = new RegExp(filters.search, 'i');
        query.$or = [
          { name: searchRegex },
          { contact: searchRegex },
          { email: searchRegex },
          { contractNumber: searchRegex }
        ];
      }
      
      if (filters.status) query.status = filters.status;

      const clients = await Client.find(query)
        .sort({ createdAt: -1 })
        .lean();
      
      return { success: true, data: clients };
    } catch (error) {
      console.error('Error in getAllClients:', error);
      return { success: false, error: error.message };
    }
  }

  // Récupérer un client par ID
  async getClientById(clientId) {
    try {
      const client = await Client.findById(clientId);
      
      if (!client) {
        return { success: false, error: 'Client non trouvé', status: 404 };
      }
      
      return { success: true, data: client };
    } catch (error) {
      console.error('Error in getClientById:', error);
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Créer un nouveau client
  async createClient(clientData) {
    try {
      console.log('Creating client with data:', clientData);
      
      // Vérifier si le numéro de contrat existe déjà
      const existingClient = await Client.findOne({ 
        contractNumber: clientData.contractNumber 
      });
      
      if (existingClient) {
        return { 
          success: false, 
          error: 'Un client avec ce numéro de contrat existe déjà', 
          status: 400 
        };
      }

      const client = new Client(clientData);
      const savedClient = await client.save();
      
      console.log('Client created successfully:', savedClient);
      
      return { success: true, data: savedClient, status: 201 };
    } catch (error) {
      console.error('Error in createClient:', error);
      
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

  // Mettre à jour un client
  async updateClient(clientId, updateData) {
    try {
      // Vérifier si le numéro de contrat est déjà utilisé par un autre client
      if (updateData.contractNumber) {
        const existingClient = await Client.findOne({ 
          contractNumber: updateData.contractNumber,
          _id: { $ne: clientId }
        });
        
        if (existingClient) {
          return { 
            success: false, 
            error: 'Un autre client utilise déjà ce numéro de contrat', 
            status: 400 
          };
        }
      }

      const client = await Client.findByIdAndUpdate(
        clientId,
        updateData,
        { new: true, runValidators: true }
      );

      if (!client) {
        return { success: false, error: 'Client non trouvé', status: 404 };
      }

      return { success: true, data: client };
    } catch (error) {
      console.error('Error in updateClient:', error);
      
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

  // Supprimer un client
  async deleteClient(clientId) {
    try {
      const client = await Client.findByIdAndDelete(clientId);

      if (!client) {
        return { success: false, error: 'Client non trouvé', status: 404 };
      }

      return { success: true, message: 'Client supprimé avec succès' };
    } catch (error) {
      console.error('Error in deleteClient:', error);
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Rechercher des clients
  async searchClients(searchTerm) {
    try {
      const searchRegex = new RegExp(searchTerm, 'i');
      
      const clients = await Client.find({
        $or: [
          { name: searchRegex },
          { contact: searchRegex },
          { email: searchRegex },
          { contractNumber: searchRegex },
          { phone: searchRegex }
        ]
      })
      .sort({ name: 1 })
      .limit(50)
      .lean();
      
      return { success: true, data: clients };
    } catch (error) {
      console.error('Error in searchClients:', error);
      return { success: false, error: error.message };
    }
  }

  // Compter les clients par statut
  async getClientsStats() {
    try {
      const stats = await Client.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);
      
      return { success: true, data: stats };
    } catch (error) {
      console.error('Error in getClientsStats:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new ClientService();