// controllers/authController.js
const authService = require('../services/authServices');

const register = async (req, res) => {
  try {
    const { firstname, lastname, email, phone, password } = req.body;
    const result = await authService.registerUser({ firstname, lastname, email, phone, password });
    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });
    res.status(200).json({
      message: 'Connexion réussie',
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { register, login };
