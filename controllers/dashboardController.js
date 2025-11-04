const Event = require('../models/event');
const Reservation = require('../models/reservation');
const Client = require('../models/clients');
const Service = require('../models/services');

// @desc    Récupérer les statistiques du dashboard
// @route   GET /api/dashboard/stats
// @access  Public
const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Récupérer les événements d'aujourd'hui
    const todayEvents = await Event.find({
      date: today,
      status: { $in: ['scheduled', 'confirmed'] }
    });

    // Récupérer les événements de la semaine
    const weekEvents = await Event.find({
      date: { $gte: startOfWeek },
      status: { $in: ['scheduled', 'confirmed'] }
    });

    // Récupérer les réservations d'aujourd'hui
    const todayReservations = await Reservation.find({
      date: today,
      status: { $in: ['confirmed', 'in-use'] }
    });

    // Récupérer les réservations de la semaine
    const weekReservations = await Reservation.find({
      date: { $gte: startOfWeek },
      status: { $in: ['confirmed', 'in-use'] }
    });

    // Compter par type d'événements aujourd'hui
    const coffeePausesToday = todayEvents.filter(event => 
      event.type === 'coffee' || event.service?.type === 'coffee'
    ).length;

    const lunchesToday = todayEvents.filter(event => 
      event.type === 'lunch' || event.service?.type === 'lunch'
    ).length;

    const enhancedCoffeeToday = todayEvents.filter(event => 
      event.type === 'coffee' && event.participants > 10
    ).length;

    // Compter par type d'événements cette semaine
    const coffeePausesWeek = weekEvents.filter(event => 
      event.type === 'coffee' || event.service?.type === 'coffee'
    ).length;

    const lunchesWeek = weekEvents.filter(event => 
      event.type === 'lunch' || event.service?.type === 'lunch'
    ).length;

    const enhancedCoffeeWeek = weekEvents.filter(event => 
      event.type === 'coffee' && event.participants > 10
    ).length;

    // Événements cocktails ce mois-ci
    const monthCocktails = await Event.countDocuments({
      date: { $gte: startOfMonth },
      type: 'cocktail',
      status: { $in: ['scheduled', 'confirmed'] }
    });

    // Prochains événements
    const nextCoffee = await Event.findOne({
      date: { $gte: today },
      $or: [
        { type: 'coffee' },
        { 'service.type': 'coffee' }
      ],
      status: { $in: ['scheduled', 'confirmed'] }
    }).sort({ date: 1, startTime: 1 });

    const nextLunch = await Event.findOne({
      date: { $gte: today },
      $or: [
        { type: 'lunch' },
        { 'service.type': 'lunch' }
      ],
      status: { $in: ['scheduled', 'confirmed'] }
    }).sort({ date: 1, startTime: 1 });

    const nextCocktail = await Event.findOne({
      date: { $gte: today },
      type: 'cocktail',
      status: { $in: ['scheduled', 'confirmed'] }
    }).sort({ date: 1, startTime: 1 });

    const nextReservation = await Reservation.findOne({
      date: { $gte: today },
      status: { $in: ['confirmed'] }
    }).sort({ date: 1, startTime: 1 });

    // Formater les dates pour l'affichage
    const formatNextEvent = (event) => {
      if (!event) return 'N/A';
      
      const eventDate = new Date(event.date);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      if (eventDate.toDateString() === today.toDateString()) {
        return `Aujourd'hui, ${event.startTime}`;
      } else if (eventDate.toDateString() === tomorrow.toDateString()) {
        return `Demain, ${event.startTime}`;
      } else {
        return `${eventDate.toLocaleDateString('fr-FR')}, ${event.startTime}`;
      }
    };

    const stats = {
      coffeePauses: {
        today: coffeePausesToday,
        thisWeek: coffeePausesWeek,
        next: formatNextEvent(nextCoffee)
      },
      lunches: {
        today: lunchesToday,
        reservedPlaces: todayEvents
          .filter(event => event.type === 'lunch' || event.service?.type === 'lunch')
          .reduce((sum, event) => sum + (event.participants || 1), 0),
        next: formatNextEvent(nextLunch)
      },
      reservations: {
        ongoing: todayReservations.length,
        thisWeek: weekReservations.length,
        next: formatNextEvent(nextReservation)
      },
      enhancedCoffee: {
        today: enhancedCoffeeToday,
        thisWeek: enhancedCoffeeWeek,
        next: formatNextEvent(nextCoffee)
      },
      cocktails: {
        scheduled: monthCocktails,
        thisMonth: monthCocktails,
        next: formatNextEvent(nextCocktail)
      },
      roomRentals: {
        today: todayReservations.length,
        thisWeek: weekReservations.length,
        next: formatNextEvent(nextReservation)
      }
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques du dashboard',
      error: error.message
    });
  }
};

// @desc    Récupérer un aperçu complet du dashboard
// @route   GET /api/dashboard/overview
// @access  Public
const getDashboardOverview = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Récupérer les données en parallèle
    const [
      upcomingEvents,
      activeClients,
      todayEvents,
      todayReservations,
      totalServices
    ] = await Promise.all([
      // Événements à venir (limité à 5)
      Event.find({
        date: { $gte: today },
        status: { $in: ['scheduled', 'confirmed'] }
      })
      .populate('client', 'name')
      .populate('service', 'title type')
      .sort({ date: 1, startTime: 1 })
      .limit(5),

      // Clients actifs
      Client.find({ status: 'active' })
      .sort({ name: 1 })
      .limit(5),

      // Événements d'aujourd'hui
      Event.find({
        date: today,
        status: { $in: ['scheduled', 'confirmed'] }
      }),

      // Réservations d'aujourd'hui
      Reservation.find({
        date: today,
        status: { $in: ['confirmed', 'in-use'] }
      }),

      // Total des services
      Service.countDocuments({ status: 'active' })
    ]);

    const overview = {
      upcomingEvents: upcomingEvents.map(event => ({
        id: event._id,
        name: event.name,
        date: event.date,
        status: event.status,
        client: event.client?.name,
        type: event.type
      })),
      activeClients: activeClients.map(client => ({
        id: client._id,
        name: client.name,
        service: 'Services variés', // Vous pourriez agréger les services par client
        status: client.status
      })),
      quickStats: {
        eventsToday: todayEvents.length,
        reservationsToday: todayReservations.length,
        activeClients: activeClients.length,
        totalServices: totalServices
      }
    };

    res.json({
      success: true,
      data: overview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'aperçu du dashboard',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats,
  getDashboardOverview
};