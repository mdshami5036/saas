const express = require('express');
const router = express.Router();
const { registerCafe, loginCafe, getMe } = require('../controllers/authController');
const { authenticateTenant } = require('../middleware/authMiddleware');

router.post('/register', registerCafe);
router.post('/login', loginCafe);
router.get('/me', authenticateTenant, getMe);

module.exports = router;
