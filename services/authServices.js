// services/authService.js
const User = require('../models/users');
const jwt = require('jsonwebtoken');

const registerUser = async ({ firstname, lastname, email, phone, password }) => {
  // Vérifier si l'utilisateur existe déjà
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email déjà utilisé');
  }

  // Créer l'utilisateur
  const user = await User.create({ firstname, lastname, email, phone, password });

  // Générer token JWT
  const token = generateToken(user._id);

  return { user, token };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Email ou mot de passe invalide');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Email ou mot de passe invalide');
  }

  const token = generateToken(user._id);
  return { user, token };
};

// Génération token JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

module.exports = {
  registerUser,
  loginUser,
};
