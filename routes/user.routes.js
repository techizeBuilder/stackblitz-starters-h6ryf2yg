const express = require('express');
const { getAllUsers, createUser } = require('../controllers/user.controller');
const validateUser = require('../middleware/validateUser');

const router = express.Router();

router.get('/', getAllUsers);
router.post('/', validateUser, createUser);

module.exports = router;