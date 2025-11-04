const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre est obligatoire'],
      trim: true,
      maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères'],
    },
    description: {
      type: String,
      required: [true, 'La description est obligatoire'],
      trim: true,
      maxlength: [500, 'La description ne peut pas dépasser 500 caractères'],
    },
    price: {
      type: String,
      required: [true, 'Le prix est obligatoire'],
      trim: true,
      // Optionnel : validation personnalisée pour le format du prix
      validate: {
        validator: function (v) {
          // Accepte les formats comme "15", "15.50", "15,50", "15 €", "15 €/personne", etc.
          return /^[\d\s,./€]+$/.test(v);
        },
        message: 'Le prix doit être un nombre ou un format valide (ex: 15, 15.50, 15 €, 15 €/personne)',
      },
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'new', 'limited'],
        message: 'Le statut doit être "active", "new" ou "limited"',
      },
      default: 'active',
    },
    type: {
      type: String,
      enum: {
        values: ['coffee', 'lunch', 'cocktail', 'room_rental', 'enhanced_coffee', 'reservation'],
        message: 'Le type doit être : "coffee", "lunch", "cocktail", "room_rental", "enhanced_coffee" ou "reservation"',
      },
      required: [true, 'Le type de service est obligatoire'],
    },
  },
  {
    timestamps: true, // Ajoute createdAt et updatedAt automatiquement
  }
);

// Index pour optimiser les requêtes par type
serviceSchema.index({ type: 1 });

// Méthode pour formater le prix selon le type (optionnel, pour le backend)
serviceSchema.methods.formatPrice = function () {
  const price = this.price;
  switch (this.type) {
    case 'coffee':
    case 'enhanced_coffee':
      return `${price} €/personne`;
    case 'lunch':
      return `${price} €/repas`;
    case 'cocktail':
      return `${price} €/événement`;
    case 'room_rental':
      return `${price} €/salle`;
    case 'reservation':
      return `${price} €/réservation`;
    default:
      return `${price} €`;
  }
};

module.exports = mongoose.model('Service', serviceSchema);
