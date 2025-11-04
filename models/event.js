const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom de l\'événement est obligatoire'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  date: {
    type: String, // Changé en String pour stocker YYYY-MM-DD
    required: [true, 'La date de l\'événement est obligatoire'],
    match: [/^\d{4}-\d{2}-\d{2}$/, 'La date doit être au format YYYY-MM-DD']
  },
  type: {
    type: String,
    required: [true, 'Le type d\'événement est obligatoire'],
    enum: {
      values: ['coffee', 'lunch', 'cocktail', 'meeting', 'training', 'other'],
      message: 'Le type doit être: coffee, lunch, cocktail, meeting, training ou other'
    }
  },
  client: {
    name: {
      type: String,
      trim: true,
      maxlength: [100, 'Le nom du client ne peut pas dépasser 100 caractères']
    },
    contact: {
      type: String,
      trim: true,
      maxlength: [100, 'Le contact ne peut pas dépasser 100 caractères']
    }
  },
  service: {
    title: {
      type: String,
      trim: true,
      maxlength: [100, 'Le titre du service ne peut pas dépasser 100 caractères']
    },
    type: {
      type: String,
      trim: true
    }
  },
  status: {
    type: String,
    enum: {
      values: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled'],
      message: 'Le statut doit être: scheduled, confirmed, in-progress, completed ou cancelled'
    },
    default: 'scheduled'
  },
  participants: {
    type: Number,
    default: 1,
    min: [1, 'Le nombre de participants doit être au moins 1']
  },
  location: {
    type: String,
    required: [true, 'Le lieu est obligatoire'], // Maintenant obligatoire
    trim: true,
    maxlength: [200, 'Le lieu ne peut pas dépasser 200 caractères']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Les notes ne peuvent pas dépasser 500 caractères'],
    default: ''
  },
  startTime: {
    type: String,
    required: [true, 'L\'heure de début est obligatoire'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'L\'heure doit être au format HH:MM']
  },
  endTime: {
    type: String,
    required: [true, 'L\'heure de fin est obligatoire'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'L\'heure doit être au format HH:MM']
  }
}, {
  timestamps: true
});

// Validation pour s'assurer que l'heure de fin est après l'heure de début
eventSchema.pre('save', function(next) {
  if (this.startTime && this.endTime) {
    const start = new Date(`1970-01-01T${this.startTime}:00`);
    const end = new Date(`1970-01-01T${this.endTime}:00`);
    
    if (end <= start) {
      return next(new Error('L\'heure de fin doit être après l\'heure de début'));
    }
  }
  next();
});

// Index pour optimiser les recherches
eventSchema.index({ date: 1 });
eventSchema.index({ 'client.name': 1 });
eventSchema.index({ type: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ date: 1, status: 1 });

// Méthode pour vérifier si l'événement est à venir
eventSchema.methods.isUpcoming = function() {
  const eventDate = new Date(this.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate >= today && this.status === 'scheduled';
};

// Méthode pour formatter la date pour l'affichage
eventSchema.methods.getFormattedDate = function() {
  return new Date(this.date).toLocaleDateString('fr-FR');
};

// Méthode pour obtenir la durée de l'événement
eventSchema.methods.getDuration = function() {
  const start = new Date(`1970-01-01T${this.startTime}:00`);
  const end = new Date(`1970-01-01T${this.endTime}:00`);
  const duration = (end - start) / (1000 * 60); // durée en minutes
  return duration;
};

// Méthode statique pour récupérer les événements à venir
eventSchema.statics.getUpcomingEvents = function() {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return this.find({ 
    date: { $gte: today },
    status: { $in: ['scheduled', 'confirmed'] }
  }).sort({ date: 1, startTime: 1 });
};

// Méthode statique pour récupérer les événements par type
eventSchema.statics.getEventsByType = function(type) {
  return this.find({ type }).sort({ date: 1, startTime: 1 });
};

module.exports = mongoose.model('Event', eventSchema);