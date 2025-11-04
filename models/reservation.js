const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  room: {
    type: String,
    required: [true, 'Le nom de la salle est obligatoire'],
    trim: true,
    maxlength: [50, 'Le nom de la salle ne peut pas dépasser 50 caractères']
  },
  date: {
    type: Date,
    required: [true, 'La date de réservation est obligatoire']
  },
  startTime: {
    type: String,
    required: [true, 'L\'heure de début est obligatoire']
  },
  endTime: {
    type: String,
    required: [true, 'L\'heure de fin est obligatoire']
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Le client est obligatoire']
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  purpose: {
    type: String,
    required: [true, 'L\'objet de la réservation est obligatoire'],
    trim: true,
    maxlength: [200, 'L\'objet ne peut pas dépasser 200 caractères']
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'confirmed', 'in-use', 'completed', 'cancelled'],
      message: 'Le statut doit être: pending, confirmed, in-use, completed ou cancelled'
    },
    default: 'pending'
  },
  participants: {
    type: Number,
    default: 1,
    min: [1, 'Le nombre de participants doit être au moins 1']
  },
  equipment: {
    type: [String],
    default: []
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Les notes ne peuvent pas dépasser 500 caractères']
  }
}, {
  timestamps: true
});

// Index pour optimiser les recherches
reservationSchema.index({ date: 1 });
reservationSchema.index({ room: 1 });
reservationSchema.index({ client: 1 });
reservationSchema.index({ status: 1 });
reservationSchema.index({ date: 1, room: 1 });

// Méthode pour vérifier les conflits de réservation
reservationSchema.statics.checkAvailability = async function(room, date, startTime, endTime, excludeId = null) {
  const query = {
    room,
    date,
    status: { $in: ['confirmed', 'in-use'] },
    $or: [
      { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
    ]
  };
  
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  
  const conflict = await this.findOne(query);
  return !conflict;
};

module.exports = mongoose.model('Reservation', reservationSchema);