const Reservation = require('../models/reservation');
const Client = require('../models/clients');
const Event = require('../models/event');

// @desc    Récupérer toutes les réservations
// @route   GET /api/reservations
// @access  Public
const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('client', 'name contact email')
      .populate('event', 'name type')
      .sort({ date: 1, startTime: 1 });

    res.json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des réservations',
      error: error.message
    });
  }
};

// @desc    Récupérer une réservation par ID
// @route   GET /api/reservations/:id
// @access  Public
const getReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('client', 'name contact email phone')
      .populate('event', 'name type date');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    res.json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la réservation',
      error: error.message
    });
  }
};

// @desc    Créer une réservation
// @route   POST /api/reservations
// @access  Public
const createReservation = async (req, res) => {
  try {
    const { room, date, startTime, endTime } = req.body;

    // Vérifier la disponibilité
    const isAvailable = await Reservation.checkAvailability(room, date, startTime, endTime);
    
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'La salle n\'est pas disponible pour cette plage horaire'
      });
    }

    const reservation = await Reservation.create(req.body);
    
    const populatedReservation = await Reservation.findById(reservation._id)
      .populate('client', 'name contact email')
      .populate('event', 'name type');

    res.status(201).json({
      success: true,
      data: populatedReservation
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: messages
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la réservation',
      error: error.message
    });
  }
};

// @desc    Mettre à jour une réservation
// @route   PUT /api/reservations/:id
// @access  Public
const updateReservation = async (req, res) => {
  try {
    const { room, date, startTime, endTime } = req.body;

    // Vérifier la disponibilité (exclure la réservation actuelle)
    if (room || date || startTime || endTime) {
      const isAvailable = await Reservation.checkAvailability(
        room || req.body.room, 
        date || req.body.date, 
        startTime || req.body.startTime, 
        endTime || req.body.endTime, 
        req.params.id
      );
      
      if (!isAvailable) {
        return res.status(400).json({
          success: false,
          message: 'La salle n\'est pas disponible pour cette plage horaire'
        });
      }
    }

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('client', 'name contact email')
     .populate('event', 'name type');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    res.json({
      success: true,
      data: reservation
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: messages
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la réservation',
      error: error.message
    });
  }
};

// @desc    Supprimer une réservation
// @route   DELETE /api/reservations/:id
// @access  Public
const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Réservation supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la réservation',
      error: error.message
    });
  }
};

// @desc    Vérifier la disponibilité d'une salle
// @route   GET /api/reservations/availability
// @access  Public
const checkAvailability = async (req, res) => {
  try {
    const { room, date, startTime, endTime, excludeId } = req.query;

    if (!room || !date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Les paramètres room, date, startTime et endTime sont requis'
      });
    }

    const isAvailable = await Reservation.checkAvailability(room, new Date(date), startTime, endTime, excludeId);

    res.json({
      success: true,
      available: isAvailable
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification de la disponibilité',
      error: error.message
    });
  }
};

// @desc    Récupérer les réservations à venir
// @route   GET /api/reservations/upcoming
// @access  Public
const getUpcomingReservations = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reservations = await Reservation.find({
      date: { $gte: today },
      status: { $in: ['pending', 'confirmed'] }
    })
    .populate('client', 'name contact')
    .populate('event', 'name')
    .sort({ date: 1, startTime: 1 })
    .limit(10);

    res.json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des réservations à venir',
      error: error.message
    });
  }
};

// @desc    Récupérer les statistiques hebdomadaires
// @route   GET /api/reservations/stats/weekly
// @access  Public
const getWeeklyStats = async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const stats = await Reservation.aggregate([
      {
        $match: {
          date: { $gte: oneWeekAgo }
        }
      },
      {
        $group: {
          _id: {
            day: { $dayOfWeek: '$date' },
            room: '$room'
          },
          count: { $sum: 1 },
          totalParticipants: { $sum: '$participants' }
        }
      },
      {
        $sort: { '_id.day': 1 }
      }
    ]);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques hebdomadaires',
      error: error.message
    });
  }
};

module.exports = {
  getReservations,
  getReservation,
  createReservation,
  updateReservation,
  deleteReservation,
  checkAvailability,
  getUpcomingReservations,
  getWeeklyStats
};