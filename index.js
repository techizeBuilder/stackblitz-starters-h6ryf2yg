const express = require('express');
const connectDB = require('./config/database');
const staticMiddleware = require('./middleware/static');
const errorHandler = require('./middleware/error');
const routes = require('./routes');
const config = require('./config/server');
const logger = require('./utils/logger');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(staticMiddleware);

// Routes
app.use('/', routes);

// Error Handler
app.use(errorHandler);

app.listen(config.PORT, () => {
  logger.info(`Server running in ${config.NODE_ENV} mode on http://localhost:${config.PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});