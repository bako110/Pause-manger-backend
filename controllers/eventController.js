const eventService = require('../services/eventService');

class EventController {
  // GET /events - Récupérer tous les événements
  async getEvents(req, res) {
    try {
      const filters = {
        type: req.query.type,
        status: req.query.status,
        date: req.query.date,
        search: req.query.search
      };

      const result = await eventService.getAllEvents(filters);

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.status(200).json(result);
    } catch (error) {
      console.error('Erreur getEvents:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la récupération des événements',
        error: error.message
      });
    }
  }

  // GET /events/upcoming - Événements à venir
  async getUpcomingEvents(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const result = await eventService.getUpcomingEvents(limit);

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.status(200).json(result);
    } catch (error) {
      console.error('Erreur getUpcomingEvents:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la récupération des événements à venir',
        error: error.message
      });
    }
  }

  // GET /events/stats - Statistiques des événements
  async getEventStats(req, res) {
    try {
      const result = await eventService.getEventStats();

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.status(200).json(result);
    } catch (error) {
      console.error('Erreur getEventStats:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la récupération des statistiques',
        error: error.message
      });
    }
  }

  // GET /events/:id - Récupérer un événement par ID
  async getEventById(req, res) {
    try {
      const { id } = req.params;
      const result = await eventService.getEventById(id);

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.status(200).json(result);
    } catch (error) {
      console.error('Erreur getEventById:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la récupération de l\'événement',
        error: error.message
      });
    }
  }

  // POST /events - Créer un nouvel événement
  async createEvent(req, res) {
    try {
      const eventData = {
        name: req.body.name,
        date: req.body.date,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        type: req.body.type,
        clientName: req.body.clientName,
        clientContact: req.body.clientContact,
        serviceTitle: req.body.serviceTitle,
        serviceType: req.body.serviceType,
        participants: req.body.participants,
        location: req.body.location,
        notes: req.body.notes,
        status: req.body.status
      };

      const result = await eventService.createEvent(eventData);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(201).json(result);
    } catch (error) {
      console.error('Erreur createEvent:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la création de l\'événement',
        error: error.message
      });
    }
  }

  // PUT /events/:id - Mettre à jour un événement
  async updateEvent(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const result = await eventService.updateEvent(id, updateData);

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.status(200).json(result);
    } catch (error) {
      console.error('Erreur updateEvent:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la mise à jour de l\'événement',
        error: error.message
      });
    }
  }

  // DELETE /events/:id - Supprimer un événement
  async deleteEvent(req, res) {
    try {
      const { id } = req.params;
      const result = await eventService.deleteEvent(id);

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.status(200).json(result);
    } catch (error) {
      console.error('Erreur deleteEvent:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la suppression de l\'événement',
        error: error.message
      });
    }
  }
}

module.exports = new EventController();