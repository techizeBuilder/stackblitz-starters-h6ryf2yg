const express = require('express');
const { resolve } = require('path');
const userRoutes = require('./user.routes');

const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, '../pages/index.html'));
});

router.use('/api/users', userRoutes);

module.exports = router;