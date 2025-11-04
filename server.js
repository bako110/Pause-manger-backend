const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const setupSwagger = require('./config/swagger');
const ServiceRoutes = require('./routes/serviceRoutes');  
const ClientRoutes = require('./routes/clientRoutes');
const EventRoutes = require('./routes/eventRoutes');
const ReservationRoutes = require('./routes/reservationRoutes');
const DashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Connexion DB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', ServiceRoutes);
app.use('/api/clients', ClientRoutes);
app.use('/api/events', EventRoutes);
app.use('/api/reservations', ReservationRoutes);
app.use('/api/dashboard', DashboardRoutes);

// Swagger
setupSwagger(app);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Server OK', 
    timestamp: new Date().toISOString(),
    services: ['auth', 'clients', 'services', 'events', 'reservations', 'dashboard']
  });
});

// 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));