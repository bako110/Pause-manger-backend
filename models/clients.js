const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom du client est obligatoire'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  contact: {
    type: String,
    required: [true, 'Le nom du contact est obligatoire'],
    trim: true,
    maxlength: [100, 'Le nom du contact ne peut pas dépasser 100 caractères']
  },
  email: {
    type: String,
    required: [true, 'L\'email est obligatoire'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez fournir un email valide']
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, 'Le numéro de téléphone ne peut pas dépasser 20 caractères']
  },
  address: {
    type: String,
    trim: true,
    maxlength: [200, 'L\'adresse ne peut pas dépasser 200 caractères']
  },
  contractNumber: {
    type: String,
    required: [true, 'Le numéro de contrat est obligatoire'],
    trim: true,
    unique: true,
    maxlength: [50, 'Le numéro de contrat ne peut pas dépasser 50 caractères']
  },
  status: {
    type: String,
    enum: {
      values: ['active', 'inactive'],
      message: 'Le statut doit être: active ou inactive'
    },
    default: 'active'
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
clientSchema.index({ name: 1 });
clientSchema.index({ email: 1 });
clientSchema.index({ contractNumber: 1 });
clientSchema.index({ status: 1 });

// Méthode pour vérifier si le client est actif
clientSchema.methods.isActive = function() {
  return this.status === 'active';
};

module.exports = mongoose.model('Client', clientSchema);