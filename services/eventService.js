const Event = require('../models/event');

class EventService {
  // Récupérer tous les événements
  async getAllEvents(filters = {}) {
    try {
      let query = {};
      
      // Filtrage par type
      if (filters.type) {
        query.type = filters.type;
      }
      
      // Filtrage par statut
      if (filters.status) {
        query.status = filters.status;
      }
      
      // Filtrage par date
      if (filters.date) {
        query.date = filters.date;
      }
      
      // Filtrage par recherche texte
      if (filters.search) {
        query.$or = [
          { name: { $regex: filters.search, $options: 'i' } },
          { 'client.name': { $regex: filters.search, $options: 'i' } },
          { location: { $regex: filters.search, $options: 'i' } }
        ];
      }

      const events = await Event.find(query)
        .sort({ date: 1, startTime: 1 })
        .lean();

      return {
        success: true,
        data: events,
        count: events.length
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des événements: ${error.message}`);
    }
  }

  // Récupérer un événement par ID
  async getEventById(eventId) {
    try {
      const event = await Event.findById(eventId);
      
      if (!event) {
        return {
          success: false,
          message: 'Événement non trouvé'
        };
      }

      return {
        success: true,
        data: event
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de l'événement: ${error.message}`);
    }
  }

  // Créer un nouvel événement
  async createEvent(eventData) {
    try {
      // Validation des données requises
      const requiredFields = ['name', 'date', 'startTime', 'endTime', 'type', 'location'];
      for (const field of requiredFields) {
        if (!eventData[field]) {
          return {
            success: false,
            message: `Le champ ${field} est obligatoire`
          };
        }
      }

      // Création de l'événement
      const event = new Event({
        name: eventData.name,
        date: eventData.date,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        type: eventData.type,
        client: {
          name: eventData.clientName || '',
          contact: eventData.clientContact || ''
        },
        service: {
          title: eventData.serviceTitle || '',
          type: eventData.serviceType || ''
        },
        participants: eventData.participants || 1,
        location: eventData.location,
        notes: eventData.notes || '',
        status: eventData.status || 'scheduled'
      });

      const savedEvent = await event.save();

      return {
        success: true,
        data: savedEvent,
        message: 'Événement créé avec succès'
      };
    } catch (error) {
      throw new Error(`Erreur lors de la création de l'événement: ${error.message}`);
    }
  }

  // Mettre à jour un événement
  async updateEvent(eventId, updateData) {
    try {
      const event = await Event.findByIdAndUpdate(
        eventId,
        { 
          $set: updateData,
          // Mise à jour des sous-documents
          ...(updateData.clientName && { 'client.name': updateData.clientName }),
          ...(updateData.clientContact && { 'client.contact': updateData.clientContact }),
          ...(updateData.serviceTitle && { 'service.title': updateData.serviceTitle }),
          ...(updateData.serviceType && { 'service.type': updateData.serviceType })
        },
        { new: true, runValidators: true }
      );

      if (!event) {
        return {
          success: false,
          message: 'Événement non trouvé'
        };
      }

      return {
        success: true,
        data: event,
        message: 'Événement mis à jour avec succès'
      };
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de l'événement: ${error.message}`);
    }
  }

  // Supprimer un événement
  async deleteEvent(eventId) {
    try {
      const event = await Event.findByIdAndDelete(eventId);

      if (!event) {
        return {
          success: false,
          message: 'Événement non trouvé'
        };
      }

      return {
        success: true,
        message: 'Événement supprimé avec succès'
      };
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de l'événement: ${error.message}`);
    }
  }

  // Récupérer les événements à venir
  async getUpcomingEvents(limit = 10) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const events = await Event.find({
        date: { $gte: today },
        status: { $in: ['scheduled', 'confirmed'] }
      })
      .sort({ date: 1, startTime: 1 })
      .limit(limit)
      .lean();

      return {
        success: true,
        data: events,
        count: events.length
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des événements à venir: ${error.message}`);
    }
  }

  // Récupérer les événements par type
  async getEventsByType(type) {
    try {
      const events = await Event.find({ type })
        .sort({ date: 1, startTime: 1 })
        .lean();

      return {
        success: true,
        data: events,
        count: events.length
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des événements par type: ${error.message}`);
    }
  }

  // Récupérer les statistiques des événements
  async getEventStats() {
    try {
      const stats = await Event.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      const totalEvents = await Event.countDocuments();
      const upcomingEvents = await Event.countDocuments({
        date: { $gte: new Date().toISOString().split('T')[0] },
        status: { $in: ['scheduled', 'confirmed'] }
      });

      return {
        success: true,
        data: {
          total: totalEvents,
          upcoming: upcomingEvents,
          byStatus: stats
        }
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des statistiques: ${error.message}`);
    }
  }
}

module.exports = new EventService();