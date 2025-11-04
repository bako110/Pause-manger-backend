const clientService = require('../services/clientService');

class ClientController {
  // GET /api/clients - Récupérer tous les clients
  async getClients(req, res) {
    try {
      console.log('GET /api/clients - Query:', req.query);
      
      const { search, status } = req.query;
      
      const filters = {};
      if (search) filters.search = search;
      if (status) filters.status = status;

      const result = await clientService.getAllClients(filters);
      
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
      console.error('Error in getClients controller:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur serveur lors de la récupération des clients'
      });
    }
  }

  // GET /api/clients/:id - Récupérer un client par ID
  async getClient(req, res) {
    try {
      const { id } = req.params;
      console.log('GET /api/clients/' + id);

      const result = await clientService.getClientById(id);
      
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
      console.error('Error in getClient controller:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur serveur lors de la récupération du client'
      });
    }
  }

  // POST /api/clients - Créer un nouveau client
  async createClient(req, res) {
    try {
      console.log('POST /api/clients - Body:', req.body);

      const { name, contact, email, phone, address, contractNumber, status, notes } = req.body;

      // Validation basique
      if (!name || !contact || !email || !contractNumber) {
        return res.status(400).json({
          success: false,
          error: 'Les champs obligatoires sont: nom, contact, email, numéro de contrat'
        });
      }

      const clientData = {
        name: name.trim(),
        contact: contact.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : undefined,
        address: address ? address.trim() : undefined,
        contractNumber: contractNumber.trim(),
        status: status || 'active',
        notes: notes ? notes.trim() : undefined
      };

      const result = await clientService.createClient(clientData);
      
      if (!result.success) {
        return res.status(result.status || 400).json({
          success: false,
          error: result.error,
          details: result.details
        });
      }

      res.status(201).json({
        success: true,
        message: 'Client créé avec succès',
        data: result.data
      });
    } catch (error) {
      console.error('Error in createClient controller:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur serveur lors de la création du client'
      });
    }
  }

  // PUT /api/clients/:id - Mettre à jour un client
  async updateClient(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      console.log('PUT /api/clients/' + id, '- Body:', updateData);

      // Nettoyer les données
      if (updateData.name) updateData.name = updateData.name.trim();
      if (updateData.contact) updateData.contact = updateData.contact.trim();
      if (updateData.email) updateData.email = updateData.email.trim().toLowerCase();
      if (updateData.phone) updateData.phone = updateData.phone.trim();
      if (updateData.address) updateData.address = updateData.address.trim();
      if (updateData.contractNumber) updateData.contractNumber = updateData.contractNumber.trim();
      if (updateData.notes) updateData.notes = updateData.notes.trim();

      const result = await clientService.updateClient(id, updateData);
      
      if (!result.success) {
        return res.status(result.status || 404).json({
          success: false,
          error: result.error,
          details: result.details
        });
      }

      res.json({
        success: true,
        message: 'Client mis à jour avec succès',
        data: result.data
      });
    } catch (error) {
      console.error('Error in updateClient controller:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur serveur lors de la mise à jour du client'
      });
    }
  }

  // DELETE /api/clients/:id - Supprimer un client
  async deleteClient(req, res) {
    try {
      const { id } = req.params;
      console.log('DELETE /api/clients/' + id);

      const result = await clientService.deleteClient(id);
      
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
      console.error('Error in deleteClient controller:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur serveur lors de la suppression du client'
      });
    }
  }

  // GET /api/clients/search/:term - Rechercher des clients
  async searchClients(req, res) {
    try {
      const { term } = req.params;
      console.log('GET /api/clients/search/' + term);

      if (!term || term.length < 2) {
        return res.status(400).json({
          success: false,
          error: 'Le terme de recherche doit contenir au moins 2 caractères'
        });
      }

      const result = await clientService.searchClients(term);
      
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
      console.error('Error in searchClients controller:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur serveur lors de la recherche des clients'
      });
    }
  }

  // GET /api/clients/stats - Statistiques des clients
  async getClientsStats(req, res) {
    try {
      console.log('GET /api/clients/stats');

      const result = await clientService.getClientsStats();
      
      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: result.error
        });
      }

      res.json({
        success: true,
        data: result.data
      });
    } catch (error) {
      console.error('Error in getClientsStats controller:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur serveur lors de la récupération des statistiques'
      });
    }
  }
}

module.exports = new ClientController();